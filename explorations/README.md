# Design explorations

Seven alternative designs for the site, kept for reference. `Ridgeline` won and
now lives at `src/components/Site.tsx`; these are its rejected siblings, taken
from commit `b9fd1cd` where all eight coexisted behind a hash-routed switcher.

Nothing here is compiled or shipped. `tsconfig.app.json` only includes `src`, so
these files are excluded from typechecking and the bundle.

| File             | Layout / UX model                                              |
| ---------------- | -------------------------------------------------------------- |
| `Terminal.tsx`   | Interactive shell; content via typed commands, keyboard-driven |
| `Deck.tsx`       | Full-viewport horizontal snap panels, arrow-key navigation     |
| `Broadsheet.tsx` | Multi-column print layout on warm paper (light)                |
| `Timeline.tsx`   | Vertical spine with a year readout that tracks scroll          |
| `Index.tsx`      | Filterable dense table with a ⌘K command palette               |
| `Trail.tsx`      | Topographic ground, career drawn as an elevation profile       |
| `Mosaic.tsx`     | Bento tiles that expand in place                               |

Supporting files: `registry.ts` (the `Variant` type), `registry-index.ts` (the
registry, originally `src/variants/index.ts`), `VariantPicker.tsx` (the review
switcher) and `App.reference.tsx` (the hash router that drove it).

## Reviving one

Imports here still use their original relative paths, so the files are
unmodified and work once moved back:

1. `mkdir src/variants` and move the designs you want into it, along with
   `registry.ts` and `registry-index.ts` (renamed back to `index.ts`).
2. Move `VariantPicker.tsx` into `src/components/`.
3. Replace `src/App.tsx` with `App.reference.tsx`, and trim the registry to the
   designs you kept.
4. **Restore Space Grotesk.** `Deck`, `Mosaic`, `Timeline` and `Index` use
   `font-display`, which was removed when the site settled on Ridgeline:
   ```bash
   npm install @fontsource-variable/space-grotesk
   ```
   then re-add the import to `src/main.tsx` and this token to `src/index.css`:
   ```css
   --font-display: 'Space Grotesk Variable', 'Inter Variable', ui-sans-serif, sans-serif;
   ```
   Without it those four fall back to Inter, which changes their character
   noticeably but does not break them.
5. `Broadsheet` is the only light design, so it ignores the dark `body`
   background set in `src/index.css`.

Content still comes from `src/data/`, so all of them stay in sync with the live
site's copy automatically.
