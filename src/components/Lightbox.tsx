import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Photo } from '../data/photos.generated'
import { palette } from '../theme'
import { photoSrc, photoSrcSet } from './photoSrc'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * The photo itself, cross-faded in over its own blurred placeholder.
 *
 * Keyed by slug at the call site so navigating remounts this and resets the
 * loading state, rather than showing the previous photo under a stale flag.
 */
const Frame = ({ photo, label }: { photo: Photo; label: string }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    // Sizes itself to the image, so the placeholder can sit exactly over it
    // without needing to know the fitted dimensions.
    <div className="relative inline-flex overflow-hidden rounded-xl shadow-2xl">
      <img
        // A cached image can finish before React attaches onLoad, which would
        // leave it faded out for good, so the ref checks for that case too.
        ref={(node) => {
          if (node?.complete) setLoaded(true)
        }}
        onLoad={() => setLoaded(true)}
        src={photoSrc(photo, 1800)}
        srcSet={photoSrcSet(photo)}
        sizes="(min-width: 1024px) 80vw, 100vw"
        alt={photo.caption || label}
        width={photo.width}
        height={photo.height}
        className="max-h-[68vh] w-auto max-w-full object-contain transition-opacity duration-400 ease-(--ease-out-soft) sm:max-h-[72vh]"
        style={{ opacity: loaded ? 1 : 0 }}
      />

      {/*
       * Blur-up, and nothing else. The placeholder cross-fades straight into
       * the photo in one move: a spinner on top of it read as three separate
       * loading stages rather than one, and the photo's own colours already
       * say that something is arriving.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center blur-md transition-opacity duration-400 ease-(--ease-out-soft)"
        style={{ backgroundImage: `url(${photo.lqip})`, opacity: loaded ? 0 : 1 }}
      />
    </div>
  )
}

/**
 * Full-screen viewer. The backdrop is the photo's own blur-up placeholder,
 * scaled up and heavily blurred, so the surround picks up the colour of
 * whatever you are looking at without a single extra byte over the network.
 *
 * Rendered through a portal on `document.body`. It has to escape the page: an
 * ancestor with a transform, filter or backdrop-filter becomes the containing
 * block for fixed positioning, which silently anchors this to that element
 * instead of the viewport and can drop the photo below the fold.
 */
export const Lightbox = ({ photos, index, onClose, onNavigate }: LightboxProps) => {
  const photo = photos[index]
  const swipe = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    // Stop the wall scrolling behind the viewer.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [index, photos.length, onClose, onNavigate])

  if (!photo) return null

  const label = photo.location || photo.date
  const go = (delta: number) => onNavigate((index + delta + photos.length) % photos.length)

  /*
   * Swipe to move between photos. Horizontal intent is required, so a
   * vertical drag or a tap is not read as navigation, and the threshold is in
   * pixels rather than a fraction of the screen so it feels the same on any
   * device. Pointer events rather than touch events, so a trackpad drag works
   * the same way.
   */
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const from = swipe.current
    swipe.current = null
    if (!from) return
    const dx = e.clientX - from.x
    const dy = e.clientY - from.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
    go(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-[lightbox-in_260ms_var(--ease-out-soft)_both] items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${label}, enlarged`}
      onClick={onClose}
    >
      {/* Colour-matched blurred surround */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${photo.lqip})`, opacity: 0.55 }}
      />
      {/* Blurs the wall behind as well as tinting it, so the photo is the
          only thing in focus. */}
      <div aria-hidden="true" className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: '#0f1a20d4' }} />

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 rounded-full px-3 py-2 text-sm backdrop-blur-md"
        style={{ backgroundColor: '#00000059', color: palette.sand }}
      >
        Close
      </button>

      {photos.length > 1 && (
        <>
          {(
            [
              ['Previous', -1, 'left-1 sm:left-4', '‹'],
              ['Next', 1, 'right-1 sm:right-4', '›'],
            ] as const
          ).map(([name, delta, position, glyph]) => (
            <button
              key={name}
              aria-label={name}
              onClick={(e) => {
                e.stopPropagation()
                go(delta)
              }}
              className={`absolute z-10 hidden h-11 w-11 items-center justify-center rounded-full pb-1 text-2xl backdrop-blur-md sm:flex ${position}`}
              style={{ backgroundColor: '#00000059', color: palette.sand }}
            >
              {glyph}
            </button>
          ))}
        </>
      )}

      {/*
       * Generous margins on every side rather than a full-bleed image: the
       * photo reads as a framed object against the blurred ground, and the
       * controls in the corners stay clear of it.
       */}
      <figure
        className="relative z-0 flex max-h-full max-w-[min(1400px,96vw)] flex-col items-center gap-4 px-2 py-16 sm:px-14 sm:py-20 lg:px-20"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        // A drag that leaves the figure should not be left half-tracked.
        onPointerCancel={() => (swipe.current = null)}
        style={{ touchAction: 'pan-y' }}
      >
        <Frame key={photo.slug} photo={photo} label={label} />
        <figcaption className="text-center">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: palette.stoneText }}>
            {label}
          </span>
          <span className="ml-3 font-mono text-[11px]" style={{ color: `${palette.sand}73` }}>
            {index + 1} / {photos.length}
          </span>
        </figcaption>

        {/*
         * Phone controls sit under the photo rather than over it. At this
         * width an overlaid arrow covers a real part of the image and lands
         * where a thumb already is, so it both hides the subject and competes
         * with the swipe.
         */}
        {photos.length > 1 && (
          <div className="flex items-center gap-3 sm:hidden">
            {(
              [
                ['Previous photo', -1, '‹'],
                ['Next photo', 1, '›'],
              ] as const
            ).map(([name, delta, glyph]) => (
              <button
                key={name}
                aria-label={name}
                onClick={(e) => {
                  e.stopPropagation()
                  go(delta)
                }}
                className="flex h-11 w-16 items-center justify-center rounded-full pb-1 text-2xl backdrop-blur-md"
                style={{ backgroundColor: '#ffffff1a', color: palette.sand }}
              >
                {glyph}
              </button>
            ))}
          </div>
        )}
      </figure>

      <style>{`@keyframes lightbox-in{from{opacity:0}to{opacity:1}}`}</style>
    </div>,
    document.body,
  )
}
