import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

import { collectionPhotos, collections } from '../data/collections'
import { navigate } from '../routes'
import { useHydrated } from '../useHydrated'
import { useRoute } from '../useRoute'
import { CollectionTile } from './CollectionTile'
import { Lightbox } from './Lightbox'
import type { TileVariant } from './tileVariant'
import { isTileVariant } from './tileVariant'

/**
 * The name shared by the print on top of a pile and the viewer it opens
 * into, so the browser morphs one into the other. One name, not one per
 * photo: only ever a single transition is in flight, and a name used twice
 * in the same frame aborts the whole thing.
 */
const MORPH = 'photo-open'

/**
 * The photo section: a shelf of collections, and the viewer one of them
 * opens into.
 *
 * There is no page in between. A collection used to expand into a masonry
 * wall of itself, which meant three steps to reach a photograph at full
 * size and a grid of thumbnails that existed only to be clicked once. The
 * pile of prints opens the print on top, and the strip along the bottom of
 * the viewer does what that grid was there for, without taking a page to
 * do it.
 *
 * The shelf stays mounted underneath the whole time, so closing the viewer
 * puts you back where you were rather than rebuilding the page around you.
 */
export const PhotoCollections = () => {
  /*
   * Which album is open lives in the URL, not in this component, so an
   * album can be linked to directly and Back closes it.
   */
  const { collection: openId } = useRoute()
  const open = collections.find((c) => c.id === openId) ?? null
  /*
   * The viewer is a portal onto `document.body`, so it cannot be part of
   * the prerendered markup. An album's document is therefore the shelf, and
   * the viewer arrives over it the moment the page is live, whether it was
   * opened by a click or by following a link straight to the album.
   */
  const hydrated = useHydrated()
  const [variant, setVariant] = useState<TileVariant>('stack')
  /*
   * Which pile is mid-flight into the viewer. The morph name is a single
   * shared name, so it has to land on exactly one cover: put it on all
   * seven and the browser sees a duplicate and skips the transition.
   */
  const [morphing, setMorphing] = useState<string | null>(null)
  /*
   * Where in the album we are. Not in the URL: an album is a thing to
   * share, a photo within it is a thing to scroll past, and putting every
   * arrow press in the history would make Back mean "previous photo" for
   * as long as it took to get out again.
   */
  const [index, setIndex] = useState(0)

  /*
   * A temporary knob for choosing a tile shape: ?tiles=hero|mosaic|stack.
   * Read after mount rather than during render, since the prerendered
   * markup has no query string and reading one during render would
   * mismatch.
   */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tiles')
    if (isTileVariant(requested)) setVariant(requested)
  }, [])

  /*
   * Opening is one move: the album becomes the route and its cover photo is
   * already enlarged when you get there. The print you clicked grows into
   * the viewer's frame rather than the page cutting to it, which is the
   * whole reason the tile looks like a pile of prints.
   *
   * `flushSync` twice, for two different reasons. The first names the pile
   * that was clicked, and has to have reached the DOM before the old frame
   * is captured, which happens the moment the transition starts. The second
   * is because the transition captures the old frame, runs its callback,
   * then captures the new one, all synchronously: a React update left to
   * its own schedule would land after that second capture and the browser
   * would see nothing change.
   *
   * Where the API is missing this is an ordinary navigation, and the
   * viewer's own fade covers it.
   */
  const openCollection = (id: string) => {
    const go = () => {
      setIndex(0)
      navigate({ view: 'photos', collection: id })
    }
    if (!document.startViewTransition) {
      setMorphing(id)
      go()
      return
    }
    flushSync(() => setMorphing(id))
    document.startViewTransition(() => flushSync(go))
  }

  return (
    <>
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
              /*
               * Dropped the moment the viewer is up. The shelf stays
               * mounted underneath, so leaving the name on the cover would
               * put it on two elements at once in the new frame, which is
               * the duplicate that cancels the transition.
               */
              morphName={
                !openId && morphing === collection.id ? MORPH : undefined
              }
              onOpen={() => openCollection(collection.id)}
            />
          )
        })}
      </div>

      {hydrated && open && (
        <Lightbox
          // Keyed by album, so opening a different one starts at its own
          // first photo rather than inheriting the last one's position.
          key={open.id}
          photos={collectionPhotos(open)}
          index={index}
          onNavigate={setIndex}
          onClose={() => navigate({ view: 'photos', collection: null })}
          title={open.title}
          morphName={index === 0 ? MORPH : undefined}
        />
      )}
    </>
  )
}
