import { principles, valuesLede } from '../data/principles'
import { palette } from '../theme'

export const ValuesContent = ({ accent }: { accent: string }) => (
  <>
    <p className="mb-10 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">{valuesLede}</p>
    <ol className="space-y-10">
      {principles.map((p, i) => (
        <li key={p.title} className="border-l pl-5 sm:pl-6" style={{ borderColor: `${accent}59` }}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs tabular-nums" style={{ color: accent }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-xl font-semibold sm:text-2xl">{p.title}</h3>
          </div>
          <p className="mt-2 max-w-2xl font-serif text-lg italic sm:text-xl" style={{ color: palette.sand }}>
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
  </>
)
