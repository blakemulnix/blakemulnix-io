import { useEffect, useState } from 'react'

import type { Variant } from '../variants/registry'

interface VariantPickerProps {
  variants: Variant[]
  current: Variant
}

/**
 * Review chrome for comparing designs. Deliberately neutral so it does not
 * read as part of any variant, and collapsible so each can be seen clean.
 */
export const VariantPicker = ({ variants, current }: VariantPickerProps) => {
  const [open, setOpen] = useState(true)

  const index = variants.findIndex((v) => v.id === current.id)

  // Bracket keys, so designs remain free to use the arrow keys themselves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.key !== '[' && e.key !== ']') return
      const next = e.key === ']' ? index + 1 : index - 1
      const target = variants[(next + variants.length) % variants.length]
      if (target) window.location.hash = `/${target.id}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, variants])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-3 bottom-3 z-50 rounded-full bg-neutral-900/90 px-3 py-2 text-xs font-medium text-neutral-300 ring-1 ring-white/15 backdrop-blur transition hover:text-white"
      >
        Designs
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-2 sm:pb-3">
      <div className="flex max-w-full items-center gap-2 rounded-xl bg-neutral-900/90 p-2 ring-1 ring-white/15 backdrop-blur-md">
        <div className="hidden shrink-0 px-1 text-[11px] leading-tight sm:block">
          <div className="font-semibold text-white">{current.name}</div>
          <div className="max-w-[22ch] truncate text-neutral-400">{current.blurb}</div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {variants.map((v, i) => {
            const active = v.id === current.id
            return (
              <a
                key={v.id}
                href={`#/${v.id}`}
                title={`${v.name} — ${v.blurb}`}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  active ? 'bg-white text-neutral-900' : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="tabular-nums">{i + 1}</span>
                <span className="ml-1.5 hidden md:inline">{v.name}</span>
              </a>
            )
          })}
        </div>

        <button
          onClick={() => setOpen(false)}
          aria-label="Hide design switcher"
          className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          Hide
        </button>
      </div>
    </div>
  )
}
