import { Segments } from '../components/Segments'
import { outsideBody, outsideLede } from '../data/outside'
import { palette } from '../theme'

/**
 * The lede, then the rest of it, all of it on the page at once.
 *
 * This used to fade the body out behind a disclosure, because the photo
 * collections lived underneath and six paragraphs pushed them most of a
 * screen down. The photographs are their own section now, so the reason for
 * hiding the writing went with them: what is left is one thing, and it can
 * just be read.
 *
 * Nothing here points at the photographs either, beyond the link the prose
 * already carries. They are the next section, and the shell's own handoff
 * at the foot of this one already says so.
 */
export const OutsideContent = ({ accent }: { accent: string }) => (
  <div className="max-w-2xl" style={{ ['--link' as string]: accent }}>
    <div style={{ color: palette.muted }}>
      {/* Tight spacing, so the lede's lines read as one block on separate
          lines rather than as separate paragraphs. */}
      <div className="space-y-1 pb-6 font-serif text-xl sm:text-2xl">
        {outsideLede.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="space-y-4 text-base leading-relaxed">
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
  </div>
)
