import { useState } from 'react'

import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const ACCENT = '#d4ff3f'
const allTech = [...new Set(experience.flatMap((e) => e.technologies))].sort()

const tile =
  'rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-colors'

/**
 * A bento wall instead of a scrolling document. Tiles carry one idea each, and
 * role tiles expand in place so detail never costs a page navigation.
 */
export const MosaicVariant = () => {
  const [openRole, setOpenRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#090a09] pb-28 text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="grid auto-rows-min grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identity */}
          <div
            className="rounded-2xl p-6 sm:col-span-2 sm:row-span-2 sm:p-8"
            style={{
              background: `linear-gradient(145deg, ${ACCENT}, #9fd427)`,
            }}
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-black/60 uppercase">
              {profile.location}
            </p>
            <h1 className="font-display mt-3 text-4xl leading-[0.95] font-bold tracking-tight text-black sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-black/70 sm:text-xl">
              {profile.role}
            </p>
            <p className="mt-8 max-w-sm text-sm text-black/60">
              {profile.tagline}
            </p>
          </div>

          {/* About */}
          <div className={`${tile} sm:col-span-2`}>
            <h2 className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
              About
            </h2>
            <p className="font-display mt-3 text-xl text-white">
              {profile.greeting} 👋
            </p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-400">
              {aboutParagraphs.map((p, i) => (
                <p key={i}>
                  <Segments
                    segments={p}
                    linkClassName="text-[#d4ff3f] underline decoration-[#d4ff3f]/40 underline-offset-4"
                  />
                </p>
              ))}
            </div>
          </div>

          <div className={`${tile} flex flex-col justify-between`}>
            <span className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
              Elsewhere
            </span>
            <ul className="mt-6 flex gap-4">
              {socialLinks.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-neutral-400 transition hover:text-white"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Role tiles, expanding in place */}
          {experience.map((e, i) => {
            const key = `${e.company}-${e.start}`
            const isOpen = openRole === key
            return (
              <div
                key={key}
                className={`${tile} ${isOpen ? 'sm:col-span-2 lg:col-span-4' : ''} ${
                  isOpen ? 'border-[#d4ff3f]/40' : 'hover:border-white/25'
                }`}
              >
                <button
                  onClick={() => setOpenRole(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  className="w-full text-left"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
                      {e.start.replace(/^\w+ /, '')}–
                      {e.end ? e.end.replace(/^\w+ /, '') : 'now'}
                    </span>
                    <span
                      className="font-mono text-[11px] tabular-nums"
                      style={{ color: isOpen ? ACCENT : '#52525b' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className="font-display mt-3 block text-lg leading-snug font-semibold text-white">
                    {e.title}
                  </span>
                  <span
                    className="mt-1 block text-sm"
                    style={{ color: ACCENT }}
                  >
                    {e.company}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="max-w-3xl text-sm leading-relaxed text-neutral-400">
                      {e.summary}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {e.technologies.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-neutral-400"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={e.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-xs underline underline-offset-4"
                      style={{ color: ACCENT }}
                    >
                      Visit {e.company} →
                    </a>
                  </div>
                )}
              </div>
            )
          })}

          {/* Stack */}
          <div className={`${tile} sm:col-span-2`}>
            <h2 className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
              Stack
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {allTech.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-neutral-300"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-neutral-600">
          Tap a role to expand it
        </p>
      </div>
    </div>
  )
}
