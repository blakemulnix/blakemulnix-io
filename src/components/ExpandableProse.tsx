import { useEffect, useId, useRef, useState } from 'react'

import { palette } from '../theme'
import { ArrowRightIcon } from './icons'

/**
 * A run of prose that opens from a teaser.
 *
 * Collapsed, it shows the first few lines and lets them fade out mid
 * sentence rather than stopping at a hard edge: a clean cut reads as the
 * end of the text, while a fade reads as "there is more", which is the
 * whole job of a teaser.
 *
 * The control underneath borrows the landing nav's vocabulary, a hairline
 * rule with a label on the left and an arrow in a circle on the right, so
 * it reads as part of the page rather than as a link someone bolted on.
 */
export const ExpandableProse = ({
  paragraphs,
  accent,
  label = 'More about me',
  labelWhenOpen = 'Less about me',
  collapsed = '9.5rem',
  className = '',
}: {
  paragraphs: string[]
  accent: string
  label?: string
  labelWhenOpen?: string
  /** Teaser height. Enough for three or four lines at either design's size. */
  collapsed?: string
  className?: string
}) => {
  const [expanded, setExpanded] = useState(false)
  const bodyId = useId()
  const inner = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState<number | null>(null)

  /*
   * Closing from the bottom of nine hundred pixels of prose pulls the page
   * out from under the reader: the control they just clicked ends up above
   * the viewport and they are left looking at something further down the
   * page. Scroll back to the top of the block, but only when it has
   * actually gone off screen.
   */
  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    if (next) return
    const top = box.current?.getBoundingClientRect().top ?? 0
    // scrollIntoView rather than window.scrollBy, since the scroller is not
    // always the window: in the dev design gallery the page sits inside its
    // own scrolling box, and scrolling the window there does nothing.
    if (top < 0)
      box.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  /*
   * Height is animated to a measured pixel value rather than to `auto`,
   * which does not interpolate. Measured through a ResizeObserver rather
   * than once on mount, so a late webfont, a resize, or an edit to the copy
   * cannot leave the open state clipped to a stale height.
   */
  useEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setFull(el.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        id={bodyId}
        ref={box}
        className="scroll-mt-6 overflow-hidden transition-[height,--fade-start] duration-[600ms] ease-(--ease-out-soft)"
        style={{
          height: expanded && full !== null ? full : collapsed,
          /*
           * A mask rather than a gradient overlay in the ground colour: the
           * two designs sit on different backgrounds, and a mask fades the
           * text itself, so neither has to be told what is behind it.
           */
          ['--fade-start' as string]: expanded ? '100%' : '38%',
          maskImage:
            'linear-gradient(to bottom, #000 var(--fade-start), transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 var(--fade-start), transparent)',
        }}
      >
        <div ref={inner} className={`space-y-4 ${className}`}>
          {paragraphs.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      <button
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        className="group mt-4 flex w-full cursor-pointer items-center justify-between gap-3 border-t py-4 text-left"
        style={{ borderColor: `${palette.sand}1a` }}
      >
        <span
          className="font-mono text-[0.7rem] tracking-[0.25em] uppercase"
          style={{ color: accent }}
        >
          {expanded ? labelWhenOpen : label}
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-(--hover) group-hover:text-(--hover)"
          style={{
            borderColor: `${palette.sand}2e`,
            color: `${palette.sand}bf`,
            ['--hover' as string]: accent,
          }}
        >
          <ArrowRightIcon
            className="h-3.5 w-3.5 transition-transform duration-[600ms] ease-(--ease-out-soft)"
            style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)' }}
          />
        </span>
      </button>
    </>
  )
}
