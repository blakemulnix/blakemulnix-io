import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

/**
 * A printed-page layout: masthead, ruled columns, dates set as marginalia.
 * Light and warm, as a deliberate counterweight to the dark variants.
 */
export const BroadsheetVariant = () => (
  <div className="min-h-screen bg-[#f4efe3] pb-28 text-[#2b2823]">
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      {/* Masthead */}
      <header className="border-b-4 border-double border-[#2b2823] pt-10 pb-5 sm:pt-16">
        <p className="font-mono text-[10px] tracking-[0.35em] text-[#6b6455] uppercase">
          {profile.location} · Est. dial-up
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          {profile.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-[#2b2823]/25 pt-3">
          <p className="font-serif text-lg italic sm:text-2xl">{profile.role}</p>
          <p className="font-mono text-[11px] tracking-widest text-[#6b6455] uppercase">{profile.tagline}</p>
        </div>
      </header>

      {/* Lead article, set in columns like print */}
      <section className="py-8 sm:py-12" aria-label="About">
        <h2 className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[#8a7f68] uppercase">— On the record</h2>
        <div className="gap-8 text-[15px] leading-relaxed sm:columns-2 sm:text-base [&>p]:mb-4">
          <p className="first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-[#4a5d3a]">
            {profile.greeting}. {aboutParagraphs[0]?.map((s) => (typeof s === 'string' ? s : s.text)).join('')}
          </p>
          {aboutParagraphs.slice(1).map((p, i) => (
            <p key={i}>
              <Segments
                segments={p}
                linkClassName="font-medium text-[#a9563a] underline decoration-[#a9563a]/40 underline-offset-2 hover:decoration-[#a9563a]"
              />
            </p>
          ))}
        </div>
      </section>

      {/* Career, as a ruled register with dates in the margin */}
      <section className="border-t-2 border-[#2b2823] pt-6" aria-label="Experience">
        <h2 className="mb-6 font-serif text-2xl font-semibold sm:text-3xl">The Record</h2>
        <ol>
          {experience.map((e) => (
            <li
              key={`${e.company}-${e.start}`}
              className="grid gap-2 border-b border-[#2b2823]/15 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-[11px] leading-relaxed tracking-widest text-[#6b6455] uppercase">
                {e.start}
                <br className="hidden sm:block" />
                <span className="sm:hidden"> — </span>
                {e.end ?? 'Present'}
              </p>
              <div>
                <h3 className="font-serif text-xl font-semibold sm:text-2xl">
                  {e.title},{' '}
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="italic underline decoration-[#a9563a]/50 underline-offset-4 hover:decoration-[#a9563a]"
                  >
                    {e.company}
                  </a>
                </h3>
                <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-[#4a463d]">{e.summary}</p>
                <p className="mt-3 font-mono text-[11px] tracking-wide text-[#6b6455]">{e.technologies.join(' · ')}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Colophon */}
      <footer className="flex flex-wrap items-center justify-between gap-4 py-8">
        <ul className="flex gap-5">
          {socialLinks.map(({ label, url, Icon }) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noreferrer" className="text-[#6b6455] transition hover:text-[#a9563a]">
                <span className="sr-only">{label}</span>
                <Icon className="h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  </div>
)
