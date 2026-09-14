import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const LIME = 'text-[#b8f52c]'
const COMMANDS = ['about', 'experience', 'stack', 'links', 'resume', 'help', 'clear'] as const

interface Line {
  id: number
  prompt?: string
  body?: ReactNode
}

const Prompt = () => (
  <span>
    <span className="text-[#b8f52c]">blake</span>
    <span className="text-neutral-500">@</span>
    <span className="text-[#7dd3fc]">blakemulnix.io</span>
    <span className="text-neutral-500">:~$ </span>
  </span>
)

const allTech = [...new Set(experience.flatMap((e) => e.technologies))].sort()

const output = (cmd: string): ReactNode => {
  switch (cmd) {
    case 'about':
      return (
        <div className="max-w-prose space-y-3 text-neutral-300">
          <p className={LIME}>{profile.greeting} 👋</p>
          {aboutParagraphs.map((p, i) => (
            <p key={i}>
              <Segments segments={p} linkClassName="text-[#b8f52c] underline decoration-dotted hover:bg-[#b8f52c]/15" />
            </p>
          ))}
        </div>
      )
    case 'experience':
      return (
        <div className="space-y-4">
          {experience.map((e) => (
            <div key={`${e.company}-${e.start}`}>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className={LIME}>{e.title}</span>
                <span className="text-neutral-500">@</span>
                <a
                  href={e.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-100 underline decoration-neutral-600 hover:decoration-[#b8f52c]"
                >
                  {e.company}
                </a>
                <span className="text-neutral-400">
                  [{e.start} — {e.end ?? 'present'}]
                </span>
              </div>
              <p className="mt-1 max-w-prose text-neutral-400">{e.summary}</p>
              <p className="mt-1 text-neutral-500">{e.technologies.join(' · ')}</p>
            </div>
          ))}
        </div>
      )
    case 'stack':
      return (
        <div className="flex max-w-3xl flex-wrap gap-x-3 gap-y-1 text-neutral-300">
          {allTech.map((t) => (
            <span key={t}>
              <span className="text-neutral-600">—</span> {t}
            </span>
          ))}
        </div>
      )
    case 'links':
      return (
        <ul className="space-y-1">
          {socialLinks.map((s) => (
            <li key={s.label}>
              <span className="inline-block w-20 text-neutral-500">{s.label.toLowerCase()}</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-[#b8f52c] underline decoration-dotted">
                {s.url.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      )
    case 'resume':
      return (
        <p>
          <a href={profile.resumeUrl} className="text-[#b8f52c] underline decoration-dotted">
            BlakeMulnixResume.pdf
          </a>
          <span className="text-neutral-500"> — opening…</span>
        </p>
      )
    case 'help':
      return (
        <div className="text-neutral-300">
          <p className="text-neutral-500">available commands:</p>
          <div className="mt-1 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
            {COMMANDS.map((c) => (
              <span key={c} className={LIME}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )
    default:
      return (
        <p className="text-red-400">
          command not found: {cmd} <span className="text-neutral-500">— try `help`</span>
        </p>
      )
  }
}

export const TerminalVariant = () => {
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const nextId = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    if (cmd === 'clear') {
      setLines([])
      return
    }
    setLines((prev) => [...prev, { id: nextId.current++, prompt: cmd }, { id: nextId.current++, body: output(cmd) }])
    if (cmd === 'resume') window.open(profile.resumeUrl, '_blank')
  }

  // Greet with the about block so the page is never an empty prompt.
  useEffect(() => {
    setLines([
      { id: nextId.current++, prompt: 'about' },
      { id: nextId.current++, body: output('about') },
    ])
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  return (
    <div
      className="min-h-screen bg-[#08090a] px-3 pt-3 pb-28 font-mono text-[13px] leading-relaxed sm:px-6 sm:pt-6 sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Faint scanline texture, purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'repeating-linear-gradient(180deg,#fff 0 1px,transparent 1px 3px)' }}
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#b8f52c]" />
          </span>
          <h1 className="ml-2 text-neutral-400">
            {profile.name} — {profile.role}
          </h1>
        </header>

        <div aria-live="polite" className="space-y-3">
          {lines.map((line) =>
            line.prompt !== undefined ? (
              <div key={line.id} className="text-neutral-100">
                <Prompt />
                {line.prompt}
              </div>
            ) : (
              <div key={line.id}>{line.body}</div>
            ),
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            run(value)
            setValue('')
          }}
          className="mt-3 flex items-center"
        >
          <label htmlFor="cmd" className="sr-only">
            Enter a command
          </label>
          <Prompt />
          <input
            id="cmd"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="ml-1 w-full flex-1 bg-transparent text-neutral-100 caret-[#b8f52c] outline-none"
          />
        </form>

        {/* Tappable commands, since typing on a phone is no fun. */}
        <div className="mt-5 flex flex-wrap gap-2">
          {COMMANDS.map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="rounded border border-white/15 px-2.5 py-1 text-xs text-neutral-400 transition hover:border-[#b8f52c]/60 hover:text-[#b8f52c]"
            >
              {c}
            </button>
          ))}
        </div>
        <div ref={endRef} />
      </div>
    </div>
  )
}
