import { principles, valuesLede } from '../data/principles'
import { palette } from '../theme'

/** Rust is reserved for this section, which keeps the added colour purposeful. */
export const HowIWork = () => (
  <section id="how-i-work" className="scroll-mt-8 pt-20">
    <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: palette.rust }}>
      How I Work
    </h2>
    <p className="mt-4 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">{valuesLede}</p>

    <ol className="mt-12 space-y-12">
      {principles.map((p, i) => (
        <li key={p.title} className="border-l pl-6 sm:pl-8" style={{ borderColor: `${palette.rust}4d` }}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs tabular-nums" style={{ color: palette.rust }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-xl font-semibold sm:text-2xl">{p.title}</h3>
          </div>

          <p className="mt-3 max-w-2xl font-serif text-lg italic sm:text-xl" style={{ color: palette.sand }}>
            {p.lede}
          </p>

          <div className="mt-3 max-w-2xl space-y-3 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
            {p.body.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </div>
        </li>
      ))}
    </ol>
  </section>
)
