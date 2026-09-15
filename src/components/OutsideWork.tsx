import { outsideIntro } from '../data/outside'
import { palette } from '../theme'
import { PhotoWall } from './PhotoWall'

export const OutsideWork = () => (
  <section id="outside" className="scroll-mt-8 pt-20">
    <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: palette.stone }}>
      Outside Work
    </h2>

    <div className="mt-4 max-w-2xl space-y-4 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
      {outsideIntro.map((p, i) => (
        <p key={i} className={i === 0 ? 'font-serif text-xl not-italic sm:text-2xl' : undefined}>
          {p}
        </p>
      ))}
    </div>

    <div className="mt-10">
      <PhotoWall />
    </div>
  </section>
)
