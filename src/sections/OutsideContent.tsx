import { outsideIntro, photos } from '../data/outside'
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

    <div className="mt-8 columns-2 gap-3 sm:columns-3">
      {photos.map((photo, i) => (
        <figure key={i} className="mb-3 break-inside-avoid">
          {photo.src ? (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={`${photo.alt} image`}
              className={`flex w-full items-center justify-center rounded-lg ${photo.portrait ? 'aspect-3/4' : 'aspect-4/3'}`}
              style={{
                background: `linear-gradient(145deg, ${accent}2b, ${palette.stone}33 55%, ${palette.ochre}1f)`,
                border: `1px solid ${palette.sand}14`,
              }}
            >
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${palette.sand}59` }}>
                Photo
              </span>
            </div>
          )}
          <figcaption className="mt-1.5 font-mono text-[10px] tracking-widest uppercase" style={{ color: accent }}>
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
)
