/**
 * Renders the Open Graph card to public/og.jpg.
 *
 * The card is built from the site's own fonts, palette and photography rather
 * than drawn by hand, so it cannot drift from the site it represents. Run this
 * after changing the template, the tagline or the photo it uses.
 *
 * Bump the `?v=` on og:image in index.html afterwards: Facebook, LinkedIn and
 * Slack all cache by URL, and some of them for weeks.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const template = path.join(root, 'scripts/og-card/card.html')
const out = path.join(root, 'public/og.jpg')

/*
 * The name, role and tagline come from about.ts, so the card says whatever the
 * site says. Read with a regex rather than an import, because this runs
 * against the TypeScript source and there is nothing else in that file worth
 * a build step.
 */
const about = readFileSync(path.join(root, 'src/data/about.ts'), 'utf8')
const field = (name) => {
  const match = about.match(new RegExp(`^\\s*${name}:\\s*(['"\`])(.*?)\\1`, 'ms'))
  if (!match) throw new Error(`no ${name} in src/data/about.ts`)
  return match[2]
}

// Rendered next to the template, so its relative font and photo paths hold.
const filled = path.join(root, 'scripts/og-card/.card.filled.html')
writeFileSync(
  filled,
  readFileSync(template, 'utf8')
    .replace('{{name}}', field('name'))
    .replace('{{role}}', field('role'))
    .replace('{{tagline}}', field('cardTagline')),
)

// Rendered at 2x and scaled down, which is the cheapest way to get the serif
// looking like the site's serif rather than a screenshot of it.
const profile = mkdtempSync(path.join(tmpdir(), 'og-card-'))
const raw = path.join(profile, 'card.png')

try {
  execFileSync(
    'google-chrome',
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      '--window-size=1200,630',
      `--user-data-dir=${profile}`,
      `--screenshot=${raw}`,
      `file://${filled}`,
    ],
    { stdio: 'pipe' },
  )
  execFileSync('magick', [raw, '-resize', '1200x630', '-strip', '-quality', '88', out])
} finally {
  rmSync(profile, { recursive: true, force: true })
  unlinkSync(filled)
}

console.log(`wrote ${path.relative(root, out)}, ${Math.round(statSync(out).size / 1024)}KB`)
