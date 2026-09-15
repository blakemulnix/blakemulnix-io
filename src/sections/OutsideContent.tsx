import { PhotoWall } from '../components/PhotoWall'
import { outsideAside, outsideLede } from '../data/outside'
import { palette } from '../theme'

export const OutsideContent = ({ accent }: { accent: string }) => (
  <div>
    <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
      {/* Tight spacing, so the two lines read as one block on separate lines
          rather than as two paragraphs. */}
      <div className="space-y-1 font-serif text-xl sm:text-2xl">
        {outsideLede.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <p>{outsideAside}</p>
    </div>

    <div className="mt-10" style={{ ['--photo-accent' as string]: accent }}>
      <PhotoWall />
    </div>
  </div>
)
