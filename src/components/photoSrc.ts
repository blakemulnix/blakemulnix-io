import type { Photo } from '../data/photos.generated'
import { PHOTO_WIDTHS } from '../data/photos.generated'

/**
 * One derivative URL.
 *
 * The fingerprint is what makes an edited photo reload. Filenames come from the
 * capture date, so recropping a photo would otherwise leave its URL untouched
 * and anyone holding the old bytes would keep them until the cache expired.
 */
export const photoSrc = (photo: Photo, width: number) => `/photos/${photo.slug}-${width}.webp?v=${photo.v}`

/** Full candidate set, so the browser picks by viewport and pixel density. */
export const photoSrcSet = (photo: Photo) =>
  PHOTO_WIDTHS.filter((w) => w <= photo.width)
    .map((w) => `${photoSrc(photo, w)} ${w}w`)
    .join(', ')
