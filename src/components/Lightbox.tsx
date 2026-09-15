import { useEffect } from 'react'

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
 * Full-screen viewer. The backdrop is the photo's own blur-up placeholder,
 * scaled up and heavily blurred, so the surround picks up the colour of
 * whatever you are looking at without a single extra byte over the network.
 */
export const Lightbox = ({ photos, index, onClose, onNavigate }: LightboxProps) => {
  const photo = photos[index]

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

  return (
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
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: '#0f1a20d9' }} />

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
              ['Previous', -1, 'left-2 sm:left-4', '‹'],
              ['Next', 1, 'right-2 sm:right-4', '›'],
            ] as const
          ).map(([name, delta, position, glyph]) => (
            <button
              key={name}
              aria-label={name}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate((index + delta + photos.length) % photos.length)
              }}
              className={`absolute z-10 flex h-11 w-11 items-center justify-center rounded-full pb-1 text-2xl backdrop-blur-md ${position}`}
              style={{ backgroundColor: '#00000059', color: palette.sand }}
            >
              {glyph}
            </button>
          ))}
        </>
      )}

      <figure
        className="relative z-0 flex max-h-full w-full flex-col items-center gap-3 px-3 py-14 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={photo.slug}
          src={photoSrc(photo, 1800)}
          srcSet={photoSrcSet(photo)}
          sizes="100vw"
          alt={photo.caption || label}
          width={photo.width}
          height={photo.height}
          className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        <figcaption className="text-center">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: palette.stoneText }}>
            {label}
          </span>
          <span className="ml-3 font-mono text-[11px]" style={{ color: `${palette.sand}73` }}>
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      <style>{`@keyframes lightbox-in{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}
