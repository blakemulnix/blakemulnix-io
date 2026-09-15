import { PhotoWall } from '../components/PhotoWall'
import { outsideIntro } from '../data/outside'
import { palette } from '../theme'

export const OutsideContent = ({ accent }: { accent: string }) => (
  <div>
    <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
      {outsideIntro.map((p, i) => (
        <p key={i} className={i === 0 ? 'font-serif text-xl sm:text-2xl' : undefined}>
          {p}
        </p>
      ))}
    </div>

    <div className="mt-10" style={{ ['--photo-accent' as string]: accent }}>
      <PhotoWall />
    </div>
  </div>
)
