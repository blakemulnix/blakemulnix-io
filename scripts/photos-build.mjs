#!/usr/bin/env node
/**
 * Generates web derivatives from photos/originals plus a typed module for the
 * app to import.
 *
 * Originals are 26MP and ~200MB in total, so they stay out of git; the
 * derivatives produced here are what ships and what gets committed.
 *
 * Every encode strips metadata. Two of the originals carry GPS coordinates,
 * and publishing where a photo was taken is not something to do by accident.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { format, resolveConfig } from 'prettier'

const ORIGINALS = 'photos/originals'
const MANIFEST = 'photos/manifest.json'
const OUT_DIR = 'public/photos'
const GENERATED = 'src/data/photos.generated.ts'
const GENERATED_COLLECTIONS = 'src/data/collections.generated.ts'

/** Wall needs ~400-900; the lightbox goes full screen. */
const WIDTHS = [400, 900, 1800]
const QUALITY = 82
/** Width of the inline blur-up placeholder. */
const LQIP_WIDTH = 20

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))

// Same reasoning as the manifest script: without the originals this would
// generate an empty wall and prune every committed derivative.
if (!existsSync(ORIGINALS) || manifest.photos.length === 0) {
  console.log(
    `no originals in ${ORIGINALS}, leaving ${GENERATED} and ${OUT_DIR} untouched`,
  )
  process.exit(0)
}

mkdirSync(OUT_DIR, { recursive: true })

const convert = (src, out, width, quality) =>
  execFileSync('magick', [
    src,
    '-auto-orient', // must precede -strip, which discards the orientation flag
    '-colorspace',
    'sRGB',
    '-resize',
    `${width}x>`,
    '-quality',
    String(quality),
    '-strip',
    out,
  ])

const lqip = (src) => {
  const tmp = path.join(OUT_DIR, '.lqip.webp')
  convert(src, tmp, LQIP_WIDTH, 45)
  const data = readFileSync(tmp).toString('base64')
  execFileSync('rm', ['-f', tmp])
  return `data:image/webp;base64,${data}`
}

/**
 * Reuse the blur-up placeholders from the previous run.
 *
 * Each one is another ImageMagick pass over a 26MP original, and recomputing
 * all of them dominated the runtime even when no encoding was needed: 44 of 44
 * seconds on a rerun. A placeholder can only change if its original does, which
 * is the same condition the derivatives are rebuilt on.
 */
const priorLqip = () => {
  if (!existsSync(GENERATED)) return new Map()
  const text = readFileSync(GENERATED, 'utf8')
  // Search past the `=`, since the `Photo[]` annotation has a bracket of its own.
  const declaration = text.indexOf('export const photos')
  const start = text.indexOf('[', text.indexOf('=', declaration))
  try {
    const parsed = JSON.parse(text.slice(start, text.lastIndexOf(']') + 1))
    return new Map(parsed.map((p) => [p.slug, p.lqip]))
  } catch {
    return new Map()
  }
}
const cachedLqip = priorLqip()

const entries = []
let built = 0
let skipped = 0
let reused = 0

for (const photo of manifest.photos) {
  if (photo.hidden) continue
  const src = path.join(ORIGINALS, photo.file)
  if (!existsSync(src)) {
    console.warn(`  missing original, skipping: ${photo.file}`)
    continue
  }
  const srcTime = statSync(src).mtimeMs

  let encoded = 0
  for (const width of WIDTHS) {
    const out = path.join(OUT_DIR, `${photo.slug}-${width}.webp`)
    if (existsSync(out) && statSync(out).mtimeMs >= srcTime) {
      skipped++
      continue
    }
    convert(src, out, width, QUALITY)
    built++
    encoded++
  }

  const cached = encoded === 0 ? cachedLqip.get(photo.slug) : undefined
  if (cached) reused++

  /*
   * A content fingerprint, carried in the URL as a query string.
   *
   * Derivative filenames come from the capture date rather than a hash, so
   * editing a photo in place leaves its URL identical and a browser holding
   * the old bytes has no reason to ask again. That is not theoretical: cropped
   * photos kept showing uncropped on a phone that had already cached them for
   * thirty days. The path is unchanged, so CloudFront still finds the object;
   * only the browser's cache key moves.
   */
  const fingerprint = createHash('sha256')
  for (const width of WIDTHS) {
    fingerprint.update(
      readFileSync(path.join(OUT_DIR, `${photo.slug}-${width}.webp`)),
    )
  }

  entries.push({
    collection: photo.collection ?? '',
    slug: photo.slug,
    width: photo.width,
    height: photo.height,
    date: photo.date,
    location: photo.location ?? '',
    caption: photo.caption ?? '',
    lqip: cached ?? lqip(src),
    v: fingerprint.digest('hex').slice(0, 10),
  })
}

// Derivatives are committed, so a photo that is removed or hidden would
// otherwise leave its files in the repo and on the CDN forever.
const expected = new Set(
  entries.flatMap((e) => WIDTHS.map((w) => `${e.slug}-${w}.webp`)),
)
let pruned = 0
for (const file of readdirSync(OUT_DIR)) {
  if (!file.endsWith('.webp') || expected.has(file)) continue
  unlinkSync(path.join(OUT_DIR, file))
  pruned++
}

/*
 * Manifest order, not a shuffle. The wall used to be shuffled from a fixed
 * seed, which kept it stable across builds but left no way to arrange it; the
 * order is now set by hand in the add-photos tool. The existing shuffled
 * arrangement was written into the manifest when this changed, so nothing
 * moved on the way over.
 */
const ordered = entries

const body = `// Generated by scripts/photos-build.mjs. Do not edit.
// Source of truth is photos/manifest.json; run \`npm run photos\` to refresh.

export interface Photo {
  slug: string
  /** Original pixel dimensions, used to reserve space and avoid layout shift. */
  width: number
  height: number
  date: string
  /** Where it was taken. Empty until labelled in photos/manifest.json. */
  location: string
  caption: string
  /** Inline blur-up placeholder. */
  lqip: string
  /** Content fingerprint, appended to derivative URLs so edits invalidate. */
  v: string
}

/** Widths available as \`/photos/<slug>-<width>.webp\`. */
export const PHOTO_WIDTHS = [${WIDTHS.join(', ')}] as const

/** In the order set in photos/manifest.json. */
export const photos: Photo[] = ${JSON.stringify(
  ordered.map(({ collection: _collection, ...photo }) => photo),
  null,
  2,
)}
`
/*
 * Formatted on the way out, so a rebuild never leaves the repo needing a
 * Prettier pass to go green. JSON.stringify's output is valid but not
 * canonical, and `npm run format:check` runs before the build in CI.
 */
const prettierConfig = await resolveConfig(GENERATED)
const canonical = async (source) =>
  format(source, { ...prettierConfig, parser: 'typescript' })

writeFileSync(GENERATED, await canonical(body))

/*
 * Collections, as a second module rather than a field on each photo. The wall
 * asks "what is in this collection", never "what collection is this photo
 * in", and a named group with an order of its own cannot be reconstructed
 * from a field without also encoding the group's order somewhere.
 *
 * Membership order follows the manifest, which is the order arranged in the
 * add-photos tool, so the same drag sets the wall and the collection.
 */
const named = manifest.collections ?? []
const collections = named
  .map(({ id, title }) => ({
    id,
    title,
    slugs: ordered
      .filter((photo) => photo.collection === id)
      .map((photo) => photo.slug),
  }))
  .filter((collection) => collection.slugs.length > 0)

const unfiled = ordered.filter(
  (photo) => !named.some((collection) => collection.id === photo.collection),
)
if (unfiled.length) {
  console.warn(
    `  ${unfiled.length} photos are in no collection and will not appear on the wall`,
  )
}

writeFileSync(
  GENERATED_COLLECTIONS,
  await canonical(`// Generated by scripts/photos-build.mjs. Do not edit.
// Source of truth is photos/manifest.json; group and name them in the
// add-photos tool, then run \`npm run photos\`.

export interface PhotoCollection {
  id: string
  title: string
  /** Slugs in manifest order, which is the order the wall shows them. */
  slugs: string[]
}

export const collections: PhotoCollection[] = ${JSON.stringify(collections, null, 2)}
`),
)
console.log(
  `wrote ${GENERATED_COLLECTIONS} (${collections.length} collections)`,
)
console.log(
  `encoded ${built} derivatives (${skipped} up to date, ${pruned} pruned) for ${entries.length} photos`,
)
console.log(
  `placeholders: ${reused} reused, ${entries.length - reused} generated`,
)
console.log(`wrote ${GENERATED}`)
