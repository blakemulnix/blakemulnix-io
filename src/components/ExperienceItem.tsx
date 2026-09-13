import type { ExperienceEntry } from '../data/experience'
import { ArrowUpRightIcon } from './icons'

export const ExperienceItem = ({ title, company, companyUrl, start, end, summary, technologies }: ExperienceEntry) => (
  <li className="group relative mb-10 grid transition-opacity sm:grid-cols-8 sm:gap-6 lg:group-hover/list:opacity-55 lg:hover:opacity-100!">
    {/* Hover plate, inset so it reads as a card without shifting the grid. */}
    <div className="lg:group-hover:bg-surface-800/45 absolute -inset-x-4 -inset-y-4 hidden rounded-lg transition-colors lg:-inset-x-6 lg:block lg:group-hover:shadow-lg lg:group-hover:ring-1 lg:group-hover:ring-white/10" />

    <header className="text-ink-400 relative z-10 mt-1 mb-2 text-xs font-semibold tracking-wide uppercase sm:col-span-2">
      {start} — {end ?? 'Present'}
    </header>

    <div className="relative z-10 sm:col-span-6">
      <h3 className="leading-snug font-medium">
        <a
          href={companyUrl}
          target="_blank"
          rel="noreferrer"
          className="group/link text-ink-50 hover:text-accent-200 inline-flex items-baseline text-base font-medium transition-colors"
          aria-label={`${title} at ${company} (opens in a new tab)`}
        >
          {/* Expands the hit area across the whole card on large screens. */}
          <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
          <span>
            {title} ·{' '}
            <span className="inline-block">
              {company}
              <ArrowUpRightIcon className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform duration-300 ease-(--ease-out-soft) group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </span>
          </span>
        </a>
      </h3>

      <p className="text-ink-300 mt-2 text-[0.95rem] leading-relaxed">{summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
        {technologies.map((technology) => (
          <li
            key={technology}
            className="bg-accent-300/15 text-accent-200 rounded-full px-3 py-1 text-xs leading-5 font-medium"
          >
            {technology}
          </li>
        ))}
      </ul>
    </div>
  </li>
)
