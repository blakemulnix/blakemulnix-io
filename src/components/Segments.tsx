import type { Segment } from '../data/about'

interface SegmentsProps {
  segments: Segment[]
  /** Styling for inline links, so each design controls its own accent. */
  linkClassName?: string
}

/** Renders shared prose, letting each variant style its own links. */
export const Segments = ({ segments, linkClassName }: SegmentsProps) => (
  <>
    {segments.map((segment, i) =>
      typeof segment === 'string' ? (
        segment
      ) : (
        <a key={i} href={segment.href} target="_blank" rel="noreferrer" className={linkClassName}>
          {segment.text}
        </a>
      ),
    )}
  </>
)
