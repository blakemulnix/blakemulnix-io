import { experience } from '../data/experience'
import { palette } from '../theme'

/** Section body only; each design supplies its own surrounding chrome. */
export const ExperienceContent = ({ accent }: { accent: string }) => (
  <ol className="space-y-10">
    {experience.map((e) => (
      <li key={`${e.company}-${e.start}`} className="border-l pl-5 sm:pl-6" style={{ borderColor: `${accent}59` }}>
        <p className="font-mono text-[11px] leading-4 tracking-widest uppercase" style={{ color: `${palette.sand}aa` }}>
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
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: palette.muted }}>
          {e.summary}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {e.technologies.map((t) => (
            <li
              key={t}
              className="rounded-full px-2.5 py-1 font-mono text-[11px]"
              style={{ backgroundColor: `${palette.stone}26`, color: palette.stoneText }}
            >
              {t}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ol>
)
