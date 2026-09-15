import { useCallback, useEffect, useRef, useState } from 'react'

import { photos } from '../data/photos.generated'
import { palette } from '../theme'
import { Lightbox } from './Lightbox'
import { photoSrc, photoSrcSet } from './photoSrc'

/** Rendered up front; the rest arrive as you reach the bottom. */
const INITIAL = 9
const BATCH = 9

/**
 * A masonry wall of photos that grows as you scroll.
 *
 * CSS columns rather than a grid, so portrait, landscape and panoramic frames
 * tile without per-item row spans. Each frame reserves its aspect ratio and
 * shows a blurred placeholder while loading, so nothing shifts as photos
 * arrive. The initial count is fixed rather than measured, which keeps the
 * prerendered markup identical to the first client render.
 */
export const PhotoWall = () => {
  const [visible, setVisible] = useState(INITIAL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sentinel = useRef<HTMLDivElement>(null)

  const hasMore = visible < photos.length

  useEffect(() => {
    const node = sentinel.current
    if (!node || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + BATCH, photos.length))
        }
      },
      { rootMargin: '600px 0px' }, // start fetching before they come into view
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore])

  const close = useCallback(() => setOpenIndex(null), [])
  const navigate = useCallback((i: number) => setOpenIndex(i), [])

  return (
    <>
      <div className="columns-2 gap-2.5 sm:columns-3 sm:gap-3">
        {photos.slice(0, visible).map((photo, i) => {
          const label = photo.location || photo.date
          return (
            <figure key={photo.slug} className="mb-2.5 break-inside-avoid sm:mb-3">
              <button
                onClick={() => setOpenIndex(i)}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-lg"
                aria-label={`Enlarge photo: ${label}`}
              >
                <span
                  className="block w-full bg-cover bg-center"
                  style={{
                    aspectRatio: `${photo.width} / ${photo.height}`,
                    backgroundImage: `url(${photo.lqip})`,
                  }}
                >
                  <img
                    src={photoSrc(photo, 900)}
                    srcSet={photoSrcSet(photo)}
                    sizes="(min-width: 640px) 33vw, 50vw"
                    alt={photo.caption || label}
                    width={photo.width}
                    height={photo.height}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    /*
                     * No opacity-0 plus onLoad fade here: in prerendered markup
                     * an image can finish loading before hydration attaches the
                     * handler, which would leave it invisible for good. The
                     * blurred placeholder sits behind it instead, so the image
                     * simply paints over the blur as it decodes.
                     */
                    className="h-full w-full object-cover transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.03]"
                  />
                </span>
              </button>
              <figcaption
                className="mt-1.5 font-mono text-[10px] tracking-widest uppercase"
                style={{ color: palette.stone }}
              >
                {label}
              </figcaption>
            </figure>
          )
        })}
      </div>

      {hasMore && (
        <div ref={sentinel} className="py-8 text-center">
          <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: `${palette.sand}59` }}>
            Loading more
          </span>
        </div>
      )}

      {openIndex !== null && <Lightbox photos={photos} index={openIndex} onClose={close} onNavigate={navigate} />}
    </>
  )
}
