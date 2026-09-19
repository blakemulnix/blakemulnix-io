import type { Segment } from '../data/about'
import { navigate, parsePath } from '../routes'

interface SegmentsProps {
  segments: Segment[]
  /** Styling for inline links, so each design controls its own accent. */
  linkClassName?: string
}

/** Anything but a plain left click, which the browser should keep. */
const isModified = (e: React.MouseEvent) =>
  e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0

/** Renders shared prose, letting each variant style its own links. */
export const Segments = ({ segments, linkClassName }: SegmentsProps) => (
  <>
    {segments.map((segment, i) => {
      if (typeof segment === 'string') return segment

      /*
       * A path rather than a URL means somewhere on this site, and that gets
       * handled in place rather than by reloading the document to reach a
       * view this page can already show.
       *
       * Still a real `href` either way, so crawlers follow it and middle
       * click and "open in new tab" do what they always do. Only the plain
       * left click is taken over.
       */
      const internal = segment.href.startsWith('/')

      return (
        <a
          key={i}
          href={segment.href}
          {...(internal
            ? {
                onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (isModified(e)) return
                  e.preventDefault()
                  navigate(parsePath(segment.href))
                  window.scrollTo({ top: 0, behavior: 'instant' })
                },
              }
            : { target: '_blank', rel: 'noreferrer' })}
          className={linkClassName}
        >
          {segment.text}
        </a>
      )
    })}
  </>
)
