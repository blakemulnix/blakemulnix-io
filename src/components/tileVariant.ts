/**
 * How a collection previews itself.
 *
 * Three of them, because the right answer depends on the photos: the archive
 * is almost entirely landscape, which flatters some shapes and starves
 * others. Pick one and delete the rest.
 *
 * Kept out of the component file so that file only exports components, which
 * is what fast refresh needs.
 */
export type TileVariant = 'hero' | 'mosaic' | 'stack'

export const TILE_VARIANTS: TileVariant[] = ['hero', 'mosaic', 'stack']

export const isTileVariant = (value: string | null): value is TileVariant =>
  value !== null && (TILE_VARIANTS as string[]).includes(value)
