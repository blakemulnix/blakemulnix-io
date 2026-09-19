import { useCallback, useState } from 'react'

import type { Photo } from '../data/photos.generated'
import { photos as allPhotos } from '../data/photos.generated'
import { palette } from '../theme'
import { Lightbox } from './Lightbox'
import { photoSrc, photoSrcSet } from './photoSrc'

/**
 * A masonry wall of every photo.
 *
 * CSS columns rather than a grid, so portrait, landscape and panoramic frames
 * tile without per-item row spans. Each frame reserves its aspect ratio behind
 * a blurred placeholder, so nothing shifts as photos arrive.
 *
 * Takes the photos to show, so the same wall serves the whole archive and a
 * single collection.
 *
 * Every photo is rendered up front rather than appended in batches as you
 * scroll. Multi-column layout rebalances its columns whenever content changes,
 * so appending moved photos that were already on screen into other columns:
 * measured at nine of eighteen jumping column and position mid-scroll. Nothing
 * is fetched early regardless, because each image is lazy.
 */
export const PhotoWall = ({ photos = allPhotos }: { photos?: Photo[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const navigate = useCallback((i: number) => setOpenIndex(i), [])

  return (
    <>
      <div className="columns-2 gap-2.5 sm:columns-3 sm:gap-3">
        {photos.map((photo, i) => {
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
                    /*
                     * Always lazy. The wall only appears once a section is
                     * opened, so nothing here is ever the initial LCP, and
                     * eager images inside a hidden container are fetched by
                     * the browser anyway, costing bandwidth for pixels the
                     * visitor may never look at.
                     */
                    loading="lazy"
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
                className="mt-1.5 font-mono text-[0.65rem] tracking-widest uppercase"
                style={{ color: palette.stone }}
              >
                {label}
              </figcaption>
            </figure>
          )
        })}
      </div>

      {openIndex !== null && <Lightbox photos={photos} index={openIndex} onClose={close} onNavigate={navigate} />}
    </>
  )
}
