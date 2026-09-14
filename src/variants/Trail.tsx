import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const SAND = '#e7dcc4'
const OCHRE = '#d9a05b'
const MOSS = '#93b06e'

// Oldest first, so the route reads like a trail walked forward in time.
const route = [...experience].reverse()

const CHART_W = 720
const CHART_H = 180

const points = route.map((e, i) => ({
  entry: e,
  x: (i / Math.max(1, route.length - 1)) * (CHART_W - 60) + 30,
  // Altitude stands in for progression through the career.
  y: CHART_H - 30 - (i / Math.max(1, route.length - 1)) * (CHART_H - 70),
}))

const line = points.map((p) => `${p.x},${p.y}`).join(' ')
const area = `30,${CHART_H - 10} ${line} ${CHART_W - 30},${CHART_H - 10}`

/**
 * An outdoors framing: a topographic ground, the career drawn as an elevation
 * profile, and each role a waypoint along the route.
 */
export const TrailVariant = () => (
  <div className="relative min-h-screen overflow-hidden bg-[#141d17] pb-28" style={{ color: SAND }}>
    {/* Contour ground — decorative, generated rather than an image */}
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 11 }).map((_, i) => (
        <path
          key={i}
          d={`M -50 ${120 + i * 78} C 240 ${40 + i * 74}, 560 ${240 + i * 70}, 1500 ${90 + i * 80}`}
          fill="none"
          stroke={MOSS}
          strokeWidth="1.25"
        />
      ))}
    </svg>

    <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
      <header className="pt-16 sm:pt-24">
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase" style={{ color: OCHRE }}>
          {profile.location}
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-serif text-xl italic sm:text-2xl" style={{ color: MOSS }}>
          {profile.role}
        </p>

        <div className="mt-8 max-w-2xl space-y-4 text-[15px] leading-relaxed sm:text-base">
          <p className="font-serif text-2xl">{profile.greeting}.</p>
          {aboutParagraphs.map((p, i) => (
            <p key={i} className="text-[#c9bfa6]">
              <Segments
                segments={p}
                linkClassName="font-medium underline decoration-[#d9a05b]/50 underline-offset-4 hover:decoration-[#d9a05b]"
              />
            </p>
          ))}
        </div>
      </header>

      {/* Elevation profile */}
      <section className="mt-14" aria-label="Career elevation profile">
        <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: OCHRE }}>
          The route so far
        </h2>
        <div className="mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="h-[180px] w-[720px] max-w-none sm:w-full"
            role="img"
            aria-label={`Career progression from ${route[0]?.company} to ${route[route.length - 1]?.company}`}
          >
            <polygon points={area} fill={MOSS} opacity="0.16" />
            <polyline points={line} fill="none" stroke={OCHRE} strokeWidth="2" strokeLinejoin="round" />
            {points.map(({ entry, x, y }) => (
              <g key={`${entry.company}-${entry.start}`}>
                <circle cx={x} cy={y} r="4.5" fill="#141d17" stroke={OCHRE} strokeWidth="2" />
                <text x={x} y={y - 12} textAnchor="middle" fill={SAND} fontSize="9" fontFamily="monospace">
                  {entry.start.split(' ')[1]}
                </text>
              </g>
            ))}
            <line x1="30" y1={CHART_H - 10} x2={CHART_W - 30} y2={CHART_H - 10} stroke={SAND} strokeOpacity="0.2" />
          </svg>
        </div>
      </section>

      {/* Waypoints */}
      <section className="mt-12" aria-label="Experience">
        <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: OCHRE }}>
          Waypoints
        </h2>
        <ol className="mt-6 space-y-8 border-l border-dashed pl-7 sm:pl-10" style={{ borderColor: `${MOSS}66` }}>
          {experience.map((e, i) => (
            <li key={`${e.company}-${e.start}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[calc(1.75rem+1px)] flex h-4 w-4 items-center justify-center rounded-full sm:-left-[calc(2.5rem+1px)]"
                style={{ backgroundColor: '#141d17', border: `2px solid ${OCHRE}` }}
              >
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: OCHRE }} />
              </span>
              <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: `${SAND}aa` }}>
                {e.start} — {e.end ?? 'Present'}
                <span className="ml-2" style={{ color: `${SAND}66` }}>
                  no. {experience.length - i}
                </span>
              </p>
              <h3 className="mt-1.5 font-serif text-2xl font-semibold">{e.title}</h3>
              <a
                href={e.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-lg italic underline decoration-1 underline-offset-4"
                style={{ color: MOSS }}
              >
                {e.company}
              </a>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#c9bfa6]">{e.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px]" style={{ color: `${SAND}88` }}>
                {e.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <footer
        className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t pt-8"
        style={{ borderColor: `${SAND}22` }}
      >
        <a
          href={profile.resumeUrl}
          className="rounded-full px-5 py-2.5 font-serif text-base font-semibold text-[#141d17] transition hover:brightness-105"
          style={{ backgroundColor: OCHRE }}
        >
          Full resume
        </a>
        <ul className="flex gap-5">
          {socialLinks.map(({ label, url, Icon }) => (
            <li key={label}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:opacity-70"
                style={{ color: MOSS }}
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
