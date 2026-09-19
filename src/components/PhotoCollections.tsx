import { useEffect, useState } from 'react'

import { collectionPhotos, collections } from '../data/collections'
import { navigate } from '../routes'
import { palette } from '../theme'
import { useRoute } from '../useRoute'
import { CollectionTile } from './CollectionTile'
import { ArrowRightIcon } from './icons'
import { PhotoWall } from './PhotoWall'
import type { TileVariant } from './tileVariant'
import { isTileVariant } from './tileVariant'

/**
 * The photo section: a shelf of collections, one of which opens in place.
 *
 * The flat wall of fifty seven photos had no way in. Grouped by trip, the
 * same photos arrive with a name and a season attached, and nobody has to
 * scroll past Utah to reach Iowa.
 */
export const PhotoCollections = () => {
  /*
   * Which album is open lives in the URL, not in this component, so an album
   * can be linked to directly. The route is the only state here.
   */
  const { collection: openId } = useRoute()
  const open = collections.find((c) => c.id === openId) ?? null
  const [variant, setVariant] = useState<TileVariant>('stack')

  /*
   * A temporary knob for choosing a tile shape: ?tiles=hero|mosaic|stack.
   * Read after mount rather than during render, since the prerendered markup
   * has no query string and reading one during render would mismatch.
   */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tiles')
    if (isTileVariant(requested)) setVariant(requested)
  }, [])

  if (open) {
    const photos = collectionPhotos(open)
    return (
      <div>
        <button
          onClick={() => navigate({ view: 'outside', collection: null })}
          className="group flex cursor-pointer items-center gap-2 font-mono text-[0.65rem] tracking-widest uppercase"
          style={{ color: palette.stone }}
        >
          <ArrowRightIcon className="h-3 w-3 rotate-180 transition-transform duration-300 ease-(--ease-out-soft) group-hover:-translate-x-0.5" />
          All collections
        </button>

        <h3
          className="mt-4 font-serif text-2xl"
          style={{ color: palette.sand }}
        >
          {open.title}
        </h3>
        <p
          className="mt-1 font-mono text-[0.65rem] tracking-widest uppercase"
          style={{ color: 'var(--photo-accent, currentColor)' }}
        >
          {photos.length} photos
        </p>

        <div className="mt-6">
          <PhotoWall photos={photos} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => {
        const photos = collectionPhotos(collection)
        return (
          <CollectionTile
            key={collection.id}
            title={collection.title}
            meta={`${photos.length} photos`}
            photos={photos}
            variant={variant}
            onOpen={() =>
              navigate({ view: 'outside', collection: collection.id })
            }
          />
        )
      })}
    </div>
  )
}
