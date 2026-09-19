import type { Photo } from '../data/photos.generated'
import { palette } from '../theme'
import { photoSrc } from './photoSrc'
import type { TileVariant } from './tileVariant'

/**
 * One photo inside a preview. Always cover cropped: a preview is a hint at
 * what is inside, and letterboxing three different aspect ratios inside one
 * tile reads as a bug.
 */
const Pane = ({
  photo,
  className,
  style,
}: {
  photo: Photo
  className?: string
  style?: React.CSSProperties
}) => (
  <span
    className={`block overflow-hidden bg-cover bg-center ${className ?? ''}`}
    style={{ backgroundImage: `url(${photo.lqip})`, ...style }}
  >
    <img
      src={photoSrc(photo, 900)}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04]"
    />
  </span>
)

/**
 * The cover plus two supporting photos, which is all the shapes below use.
 * Collections are never shorter than three, so the fallbacks are only here to
 * keep a half filed collection from crashing the page.
 */
const preview = (photos: Photo[]) => [
  photos[0],
  photos[1] ?? photos[0],
  photos[2] ?? photos[0],
]

const Hero = ({ photos }: { photos: Photo[] }) => {
  const [cover, second, third] = preview(photos)
  return (
    <span className="grid aspect-[4/3] grid-cols-[2fr_1fr] gap-1">
      <Pane photo={cover} className="h-full" />
      <span className="grid grid-rows-2 gap-1">
        <Pane photo={second} className="h-full" />
        <Pane photo={third} className="h-full" />
      </span>
    </span>
  )
}

const Mosaic = ({ photos }: { photos: Photo[] }) => {
  const [cover, second, third] = preview(photos)
  const fourth = photos[3] ?? cover
  return (
    <span className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-1">
      <Pane photo={cover} className="h-full" />
      <Pane photo={second} className="h-full" />
      <Pane photo={third} className="h-full" />
      <Pane photo={fourth} className="h-full" />
    </span>
  )
}

/**
 * A fanned pile of prints. The two behind rotate out and the top one
 * straightens on hover, so the tile answers a pointer without moving the
 * layout around it.
 */
const Stack = ({ photos }: { photos: Photo[] }) => {
  const [cover, second, third] = preview(photos)
  return (
    <span className="relative block aspect-[4/3] px-5 py-3">
      <Pane
        photo={third}
        className="absolute inset-x-5 inset-y-3 rotate-[-4deg] rounded-md shadow-lg transition-transform duration-500 ease-(--ease-out-soft) group-hover:rotate-[-7deg]"
      />
      <Pane
        photo={second}
        className="absolute inset-x-5 inset-y-3 rotate-[3deg] rounded-md shadow-lg transition-transform duration-500 ease-(--ease-out-soft) group-hover:rotate-[6deg]"
      />
      <Pane
        photo={cover}
        className="absolute inset-x-5 inset-y-3 rotate-[-1deg] rounded-md shadow-xl transition-transform duration-500 ease-(--ease-out-soft) group-hover:rotate-0"
      />
    </span>
  )
}

const shapes = { hero: Hero, mosaic: Mosaic, stack: Stack }

export const CollectionTile = ({
  title,
  meta,
  photos,
  variant,
  onOpen,
}: {
  title: string
  meta: string
  photos: Photo[]
  variant: TileVariant
  onOpen: () => void
}) => {
  const Shape = shapes[variant]

  return (
    <button
      onClick={onOpen}
      className="group flex h-full w-full cursor-pointer flex-col text-left"
      aria-label={`Open collection: ${title}, ${meta}`}
    >
      {/* Only the framed shapes get clipped. The stack leans out of its box on
          purpose, so rounding it would shave the corners off the prints.

          shrink-0 because a tile is stretched to its row's height, and an
          aspect ratio box handed spare height grows into it: one tile per row
          came out taller than its neighbours. */}
      <span
        className={`block shrink-0 ${variant === 'stack' ? '' : 'overflow-hidden rounded-lg'}`}
      >
        <Shape photos={photos} />
      </span>

      <span
        className="mt-3 block font-serif text-lg"
        style={{ color: palette.sand }}
      >
        {title}
      </span>
      <span
        className="mt-1 block font-mono text-[0.65rem] tracking-widest uppercase"
        style={{ color: 'var(--photo-accent, currentColor)' }}
      >
        {meta}
      </span>
    </button>
  )
}
