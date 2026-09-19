import { outsideBody, outsideLede } from '../data/outside'
import { palette } from '../theme'
import { ExpandableProse } from './ExpandableProse'
import { PhotoCollections } from './PhotoCollections'

/**
 * Same shape as the Rail design's OutsideContent, sharing the disclosure
 * itself rather than a copy of it, so the two cannot drift.
 */
export const OutsideWork = () => (
  <section id="outside" className="scroll-mt-8 pt-20">
    <h2
      className="font-mono text-[11px] tracking-[0.3em] uppercase"
      style={{ color: palette.stone }}
    >
      Outside Work
    </h2>

    <div className="mt-4 max-w-2xl" style={{ color: palette.muted }}>
      <div className="space-y-1 pb-6 font-serif text-xl not-italic sm:text-2xl">
        {outsideLede.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <ExpandableProse
        paragraphs={outsideBody}
        accent={palette.stone}
        className="text-[15px] leading-relaxed"
        collapsed="9rem"
      />
    </div>

    <div className="mt-10">
      <PhotoCollections />
    </div>
  </section>
)
