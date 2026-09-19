import type { PhotoCollection } from './collections.generated'
import { collections } from './collections.generated'
import type { Photo } from './photos.generated'
import { photos } from './photos.generated'

export type { PhotoCollection }
export { collections }

const bySlug = new Map(photos.map((photo) => [photo.slug, photo]))

/**
 * The photos of a collection, in its own order, skipping any since removed.
 *
 * Collections are grouped and named in the add-photos tool and generated into
 * collections.generated.ts, so this file only holds the lookups the app does
 * with them.
 */
export const collectionPhotos = (collection: PhotoCollection): Photo[] =>
  collection.slugs.map((slug) => bySlug.get(slug)).filter((photo): photo is Photo => photo !== undefined)

/**
 * A photo in no collection is a photo nobody can reach, which is quiet enough
 * to miss. The generator warns too; this is for anyone editing by hand.
 */
if (import.meta.env.DEV) {
  const filed = new Set(collections.flatMap((collection) => collection.slugs))
  const unfiled = photos.filter((photo) => !filed.has(photo.slug)).map((photo) => photo.slug)
  if (unfiled.length > 0) console.warn(`photos not in any collection: ${unfiled.join(', ')}`)
}
