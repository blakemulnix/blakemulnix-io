import { sectionById } from '../theme'
import { WritingContent } from '../sections/WritingContent'

/** The scroll design's Writing section, sharing the Rail's placeholder. */
export const Writing = () => {
  const { accent } = sectionById('writing')
  return (
    <section id="writing" className="scroll-mt-8 pt-20">
      <h2
        className="font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: accent }}
      >
        Writing
      </h2>
      <div className="mt-4">
        <WritingContent accent={accent} />
      </div>
    </section>
  )
}
