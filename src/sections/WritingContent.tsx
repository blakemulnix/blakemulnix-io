import { palette } from '../theme'

/**
 * A placeholder, and deliberately a short one.
 *
 * The section exists ahead of its contents so the index can carry it and
 * the URL can be linked to; there is no value in dressing that up. When the
 * first posts land this file becomes the list of them, and the
 * `placeholder` flag comes off the section in theme.ts.
 */
export const WritingContent = ({ accent }: { accent: string }) => (
  <div className="max-w-2xl">
    <p
      className="font-serif text-xl sm:text-2xl"
      style={{ color: palette.muted }}
    >
      Nothing here yet. I am working on the first few pieces, some about
      software and some not.
    </p>

    <p
      className="mt-8 font-mono text-[0.7rem] tracking-[0.25em] uppercase"
      style={{ color: accent }}
    >
      Coming soon
    </p>
  </div>
)
