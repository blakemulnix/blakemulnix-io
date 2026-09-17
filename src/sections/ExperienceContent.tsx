import { experience } from '../data/experience'
import { palette } from '../theme'

/** One pill per technology, at whichever level owns the stack. */
const Technologies = ({ items }: { items: string[] }) => (
  <ul className="mt-3 flex flex-wrap gap-1.5">
    {items.map((t) => (
      <li
        key={t}
        className="rounded-full px-2.5 py-1 font-mono text-[0.7rem]"
        style={{ backgroundColor: `${palette.stone}26`, color: palette.stoneText }}
      >
        {t}
      </li>
    ))}
  </ul>
)

/** Section body only; each design supplies its own surrounding chrome. */
export const ExperienceContent = ({ accent }: { accent: string }) => (
  <ol className="space-y-10">
    {experience.map((e) => (
      <li key={`${e.company}-${e.start}`} className="border-l pl-5 sm:pl-6" style={{ borderColor: `${accent}59` }}>
        <p
          className="font-mono text-[0.7rem] leading-4 tracking-widest uppercase"
          style={{ color: `${palette.sand}aa` }}
        >
          {e.start} - {e.end ?? 'Present'}
        </p>
        <h3 className="mt-1.5 font-serif text-xl font-semibold sm:text-2xl">{e.title}</h3>
        <a
          href={e.companyUrl}
          target="_blank"
          rel="noreferrer"
          className="font-serif text-lg italic underline decoration-1 underline-offset-4"
          style={{ color: accent }}
        >
          {e.company}
        </a>
        <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: palette.muted }}>
          {e.summary}
        </p>

        {/*
         * The stack sits at whichever level actually chose it. A consulting
         * role's own pills would only be the union of its engagements', which
         * says less than four honest lists and repeats every entry.
         */}
        {e.clients ? (
          <>
            <p className="mt-7 font-mono text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: palette.rust }}>
              Client Projects
            </p>
            {/*
             * Nested under the role rather than promoted alongside it: a
             * second border and a step down in type size are what say "inside
             * this job", which is the whole risk of listing consulting work.
             *
             * Rust marks the nesting, and the technology pills keep stone, so
             * the two levels are told apart by hue as well as by indent.
             */}
            <ol className="mt-4 space-y-6 border-l pl-4 sm:pl-5" style={{ borderColor: `${palette.rust}59` }}>
              {e.clients.map((c) => (
                <li key={c.client}>
                  <p
                    className="font-mono text-[0.65rem] tracking-widest uppercase"
                    style={{ color: `${palette.rust}c4` }}
                  >
                    {c.start} - {c.end ?? 'Present'}
                  </p>
                  <h4 className="mt-1 font-serif text-lg font-semibold">{c.client}</h4>
                  <div
                    className="mt-2 max-w-2xl space-y-2 text-[0.95rem] leading-relaxed"
                    style={{ color: palette.muted }}
                  >
                    {c.summary.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  <Technologies items={c.technologies} />
                </li>
              ))}
            </ol>
          </>
        ) : (
          <Technologies items={e.technologies} />
        )}
      </li>
    ))}
  </ol>
)
