import type { CSSProperties } from 'react'

import { aboutParagraphs, profile } from '../data/about'
import { socialLinks } from '../data/social'
import { palette } from '../theme'
import { ExperienceSpine } from './ExperienceSpine'
import { HowIWork } from './HowIWork'
import { OutsideWork } from './OutsideWork'
import { Photographs } from './Photographs'
import { Segments } from './Segments'

const SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'how-i-work', label: 'How I Work' },
  { id: 'outside', label: 'Outside Work' },
  { id: 'photos', label: 'Photographs' },
] as const

/** Decorative topographic ground. */
const ContourGround = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.11]"
    preserveAspectRatio="none"
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <path
        key={i}
        d={`M -50 ${110 + i * 82} C 260 ${30 + i * 78}, 580 ${250 + i * 74}, 1500 ${80 + i * 84}`}
        fill="none"
        stroke={palette.moss}
        strokeWidth="1.25"
      />
    ))}
  </svg>
)

export const Site = () => (
  <div
    className="relative min-h-screen overflow-hidden pb-24"
    style={{ backgroundColor: palette.pine, color: palette.sand }}
  >
    <ContourGround />

    <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
      <header className="pt-14 pb-16 sm:pt-20">
        <p
          className="font-mono text-[11px] tracking-[0.35em] uppercase"
          style={{ color: palette.ochre }}
        >
          {profile.location}
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p
          className="mt-3 font-serif text-xl italic sm:text-2xl"
          style={{ color: palette.moss }}
        >
          {profile.role}
        </p>

        <div className="mt-8 max-w-2xl space-y-4 text-[15px] leading-relaxed sm:text-base">
          {aboutParagraphs.map((p, i) => (
            <p key={i} style={{ color: palette.muted }}>
              <Segments
                segments={p}
                linkClassName="font-medium underline decoration-[#d9a05b]/50 underline-offset-4 hover:decoration-[#d9a05b]"
              />
            </p>
          ))}
        </div>

        {/* Jump links, useful now the page runs well past one screen. */}
        <nav
          aria-label="Sections"
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-mono text-[11px] tracking-[0.2em] text-(--nav) uppercase transition-colors hover:text-(--nav-active) focus-visible:text-(--nav-active)"
              style={
                {
                  '--nav': `${palette.sand}80`,
                  '--nav-active': palette.ochre,
                } as CSSProperties
              }
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <ExperienceSpine />
      <HowIWork />
      <OutsideWork />
      <Photographs />

      <footer
        className="mt-20 flex flex-wrap items-center justify-between gap-5 border-t pt-8"
        style={{ borderColor: `${palette.sand}22` }}
      >
        <p
          className="font-mono text-[11px] tracking-widest uppercase"
          style={{ color: `${palette.sand}66` }}
        >
          {profile.name}
        </p>
        <ul className="flex gap-5">
          {socialLinks.map(({ label, url, Icon }) => (
            <li key={label}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:opacity-70"
                style={{ color: palette.moss }}
              >
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
