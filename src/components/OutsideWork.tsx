import { outsideBody, outsideLede } from '../data/outside'
import { palette } from '../theme'
import { Segments } from './Segments'

/**
 * Same shape as the Rail design's OutsideContent, and for the same reasons.
 * The photographs moved out into a section of their own, so this is the
 * writing and a way through to them.
 */
export const OutsideWork = () => (
  <section id="outside" className="scroll-mt-8 pt-20">
    <h2
      className="font-mono text-[11px] tracking-[0.3em] uppercase"
      style={{ color: palette.stone }}
    >
      Outside Work
    </h2>

    <div
      className="mt-4 max-w-2xl"
      style={{ ['--link' as string]: palette.stone }}
    >
      <div
        className="space-y-1 pb-6 font-serif text-xl not-italic sm:text-2xl"
        style={{ color: palette.muted }}
      >
        {outsideLede.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div
        className="space-y-4 text-[15px] leading-relaxed"
        style={{ color: palette.muted }}
      >
        {outsideBody.map((para, i) => (
          <p key={i}>
            <Segments
              segments={para}
              linkClassName="underline decoration-1 underline-offset-4 transition-colors hover:text-(--link)"
            />
          </p>
        ))}
      </div>
    </div>
  </section>
)
