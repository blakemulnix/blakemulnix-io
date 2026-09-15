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
  const ratio = `${photo.width} / ${photo.height}`

  return (
    <>
      {/*
       * The fitted size is computed in CSS rather than waiting on the image.
       * Left to the width and height attributes the box measured 0x0 until the
       * data arrived, which shoved the caption and the phone arrow row down by
       * over 100px mid-load. `min()` picks whichever of the width and height
       * limits binds first, so the box is exactly the photo's footprint from
       * the first frame, and the placeholder and rounding line up with it.
       */}
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl"
        style={{
          aspectRatio: ratio,
          width: `min(100cqw, calc(var(--photo-h) * ${photo.width} / ${photo.height}))`,
        }}
      >
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
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-400 ease-(--ease-out-soft)"
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
    </>
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
  // Two flags, so the hint can animate both ways: it has to stay mounted
  // through its own exit.
  const [hintMounted, setHintMounted] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  // The caption clears itself shortly after each photo settles, so the whole
  // frame is visible. Tapping the photo brings it back.
  const [captionShown, setCaptionShown] = useState(true)
  // Shown once, when someone actually turns their phone.
  const [thanksMounted, setThanksMounted] = useState(false)
  const [thanksShown, setThanksShown] = useState(false)
  const thanked = useRef(false)

  // Ask for landscape, and only nudge the reader if the browser said no. The
  // click that opened this is what authorises the request, so it has to happen
  // now rather than on a later interaction.
  /*
   * Nudge, rather than rotate for them.
   *
   * Locking the orientation requires fullscreen first, and fullscreen puts a
   * banner over the page announcing itself, which is a worse interruption than
   * the thing it was solving. So the reader is asked instead.
   */
  useEffect(() => {
    if (!matchMedia('(orientation: portrait) and (max-width: 640px)').matches) return
    const timers = [
      // A beat later, so the entrance transition has a state to move from.
      setTimeout(() => setHintShown(true), 60),
      setTimeout(() => setHintShown(false), 4500),
      setTimeout(() => setHintMounted(false), 5200),
    ]
    setHintMounted(true)
    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [])

  /*
   * Say thank you when the phone actually turns. Once per viewing, so rocking
   * the phone back and forth does not set it off repeatedly, and only on a
   * screen small enough for the ask to have been made in the first place.
   */
  useEffect(() => {
    const landscape = matchMedia('(orientation: landscape)')
    const timers: ReturnType<typeof setTimeout>[] = []

    const onRotate = () => {
      if (!landscape.matches || thanked.current) return
      if (!matchMedia('(max-width: 900px)').matches) return
      thanked.current = true
      setThanksMounted(true)
      timers.push(setTimeout(() => setThanksShown(true), 60))
      timers.push(setTimeout(() => setThanksShown(false), 2200))
      timers.push(setTimeout(() => setThanksMounted(false), 2800))
    }

    landscape.addEventListener('change', onRotate)
    return () => {
      landscape.removeEventListener('change', onRotate)
      for (const timer of timers) clearTimeout(timer)
    }
  }, [])

  // Re-armed per photo, so navigating shows the new location and then clears.
  useEffect(() => {
    setCaptionShown(true)
    const timer = setTimeout(() => setCaptionShown(false), 2800)
    return () => clearTimeout(timer)
  }, [index])

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

      {/*
       * Only in portrait on a phone, and `landscape:hidden` means turning the
       * phone dismisses it with no JavaScript involved.
       */}
      {hintMounted && (
        <p
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] z-10 flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase backdrop-blur-md transition-[opacity,transform] duration-500 ease-(--ease-out-soft) sm:hidden landscape:hidden"
          style={{
            backgroundColor: '#00000073',
            color: palette.sand,
            opacity: hintShown ? 1 : 0,
            transform: hintShown ? 'none' : 'translateY(-10px)',
          }}
        >
          {/*
           * A phone that turns and holds, rather than a glyph spun through an
           * arbitrary angle and snapped back. The shape has to be obviously
           * portrait for the quarter turn to read as anything.
           */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 animate-[hint-rotate_2400ms_ease-in-out_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            <rect x="5" y="1.5" width="6" height="13" rx="1.4" />
            <line x1="6.8" y1="12.6" x2="9.2" y2="12.6" strokeLinecap="round" />
          </svg>
          Psst, turn your phone sideways
        </p>
      )}

      {/*
       * Bottom right, opposite the close button, and clear of the centred
       * caption. Same pill as every other control here: matching radius,
       * padding, blur and type, so it reads as part of the set rather than a
       * notification pasted on top.
       *
       * Kept short deliberately. "I appreciate you" measured 150px, which
       * runs into a long caption at 568x320, the narrowest landscape phone
       * still worth supporting.
       */}
      {thanksMounted && (
        <p
          className="pointer-events-none absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase backdrop-blur-md"
          style={{
            backgroundColor: '#00000073',
            color: palette.sand,
            opacity: thanksShown ? 1 : 0,
            transform: thanksShown ? 'none' : 'translateY(8px) scale(0.92)',
            transition: 'opacity 260ms var(--ease-out-soft), transform 320ms var(--ease-out-soft)',
          }}
        >
          <span
            aria-hidden="true"
            className="animate-[thanks-pop_600ms_var(--ease-out-soft)_both] text-[12px] leading-none"
            style={{ color: palette.moss }}
          >
            ✦
          </span>
          Thanks!
        </p>
      )}

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-10 rounded-full px-3 py-2 text-sm backdrop-blur-md"
        style={{ backgroundColor: '#00000059', color: palette.sand }}
      >
        Close
      </button>

      {photos.length > 1 && (
        <>
          {(
            [
              [
                'Previous',
                -1,
                'left-[max(0.25rem,env(safe-area-inset-left))] sm:left-[max(1rem,env(safe-area-inset-left))]',
                '‹',
              ],
              [
                'Next',
                1,
                'right-[max(0.25rem,env(safe-area-inset-right))] sm:right-[max(1rem,env(safe-area-inset-right))]',
                '›',
              ],
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
        /*
         * `--photo-h` is the height the photo may take. A landscape phone has
         * almost no height to spare, so there the padding and gap shrink and
         * the photo takes nearly all of it. Bounded to small screens, since a
         * desktop is landscape too and wants the breathing room.
         */
        className="@container relative z-0 flex max-h-full w-full max-w-[min(1400px,96vw)] flex-col items-center gap-4 px-2 py-16 [--photo-h:72svh] sm:px-14 sm:py-20 lg:px-20 landscape:max-lg:gap-2 landscape:max-lg:px-3 landscape:max-lg:py-2 landscape:max-lg:[--photo-h:calc(100svh-1.5rem)]"
        onClick={(e) => {
          e.stopPropagation()
          setCaptionShown((shown) => !shown)
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        // A drag that leaves the figure should not be left half-tracked.
        onPointerCancel={() => (swipe.current = null)}
        style={{ touchAction: 'pan-y' }}
      >
        <Frame key={photo.slug} photo={photo} label={label} />
        {/*
         * In landscape on a phone the caption lifts out of the flow and sits
         * over the bottom of the photo. Height is the binding constraint
         * there, and every row below the photo is width the photo does not
         * get: this buys back about a fifth of it.
         */}
        <figcaption
          className="text-center transition-opacity duration-700 ease-(--ease-out-soft) landscape:max-lg:absolute landscape:max-lg:bottom-4 landscape:max-lg:left-1/2 landscape:max-lg:-translate-x-1/2 landscape:max-lg:rounded-full landscape:max-lg:[background-color:#00000073] landscape:max-lg:px-3 landscape:max-lg:py-1 landscape:max-lg:backdrop-blur-md"
          style={{ opacity: captionShown ? 1 : 0 }}
        >
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: palette.stoneText }}>
            {label}
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

      <style>{`
        @keyframes lightbox-in{from{opacity:0}to{opacity:1}}
        /* Hold portrait, turn, hold landscape, turn back. The holds are what
           make it read as an instruction instead of a spin. */
        @keyframes hint-rotate{0%,18%{transform:rotate(0)}42%,66%{transform:rotate(-90deg)}90%,100%{transform:rotate(0)}}
        @keyframes thanks-pop{0%{transform:scale(0) rotate(-60deg)}60%{transform:scale(1.35) rotate(8deg)}100%{transform:scale(1) rotate(0)}}
      `}</style>
    </div>,
    document.body,
  )
}
