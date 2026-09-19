import { palette, sectionById } from '../theme'
import { PhotoCollections } from './PhotoCollections'

/**
 * The scroll design's photo section, matching the Rail's Photographs.
 *
 * A section of its own here too, rather than the tail of Outside Work. The
 * two designs are meant to differ in shell, not in what the site is made
 * of, and an album's URL has to mean the same thing in both.
 */
export const Photographs = () => {
  const { tagline } = sectionById('photos')
  return (
    <section
      id="photos"
      className="scroll-mt-8 pt-20"
      style={{ ['--photo-accent' as string]: palette.pewter }}
    >
      <h2
        className="font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: palette.pewter }}
      >
        Photographs
      </h2>
      <p
        className="mt-4 max-w-2xl font-serif text-xl not-italic sm:text-2xl"
        style={{ color: palette.muted }}
      >
        {tagline}
      </p>

      <div className="mt-10">
        <PhotoCollections />
      </div>
    </section>
  )
}
