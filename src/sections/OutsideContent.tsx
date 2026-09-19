import { ExpandableProse } from '../components/ExpandableProse'
import { PhotoCollections } from '../components/PhotoCollections'
import { outsideBody, outsideLede } from '../data/outside'
import { palette } from '../theme'

/**
 * The lede stays, the rest of the prose opens from a teaser, and the photo
 * collections sit right under it.
 *
 * Six paragraphs used to push the collections most of a screen down, so the
 * one thing people come to this section for was always below the fold.
 */
export const OutsideContent = ({ accent }: { accent: string }) => (
  <div>
    <div className="max-w-2xl" style={{ color: palette.muted }}>
      {/* Tight spacing, so the lede's lines read as one block on separate
          lines rather than as separate paragraphs. */}
      <div className="space-y-1 pb-6 font-serif text-xl sm:text-2xl">
        {outsideLede.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <ExpandableProse
        paragraphs={outsideBody}
        accent={accent}
        className="text-base leading-relaxed"
        collapsed="9.5rem"
      />
    </div>

    <div className="mt-10" style={{ ['--photo-accent' as string]: accent }}>
      <PhotoCollections />
    </div>
  </div>
)
