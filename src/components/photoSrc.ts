import type { Photo } from '../data/photos.generated'
import { PHOTO_WIDTHS } from '../data/photos.generated'

/** One derivative URL. */
export const photoSrc = (photo: Photo, width: number) => `/photos/${photo.slug}-${width}.webp`

/** Full candidate set, so the browser picks by viewport and pixel density. */
export const photoSrcSet = (photo: Photo) =>
  PHOTO_WIDTHS.filter((w) => w <= photo.width)
    .map((w) => `${photoSrc(photo, w)} ${w}w`)
    .join(', ')
