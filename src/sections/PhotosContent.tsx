import { PhotoCollections } from '../components/PhotoCollections'
import { palette } from '../theme'

/**
 * Photographs, with nothing in front of them.
 *
 * There is deliberately no lede here. Every other section opens with a line
 * explaining itself; this one's content is already the explanation, and a
 * paragraph above it would only be something to scroll past on the way to
 * the thing people came for.
 *
 * The section's own accent is deliberately not used inside it. That colour
 * is for the index in the margin; down here every label sits among the
 * photographs, and a coloured one casts its hue over them.
 */
export const PhotosContent = () => (
  <div style={{ ['--photo-accent' as string]: palette.pewter }}>
    <PhotoCollections />
  </div>
)
