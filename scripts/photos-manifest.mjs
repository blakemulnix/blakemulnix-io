#!/usr/bin/env node
/**
 * Builds (or refreshes) photos/manifest.json from the originals.
 *
 * One flat entry per photo, each with its own location. Idempotent: locations
 * and captions you type are matched by filename and never overwritten, so
 * re-running only picks up newly dropped files and refreshes derived facts.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ORIGINALS = 'photos/originals'
const MANIFEST = 'photos/manifest.json'
const DERIVATIVES = 'public/photos'

const identify = (file) =>
  execFileSync('magick', ['identify', '-format', '%w\t%h\t%[EXIF:DateTimeOriginal]', file], {
    encoding: 'utf8',
  }).split('\t')

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { photos: [] }
const prior = new Map((previous.photos ?? []).map((p) => [p.file, p]))

/**
 * Reuse the dimensions and capture date already in the manifest.
 *
 * `magick identify` on a 26MP file is not free, and re-reading every original
 * on each run made the labelling tool take a minute to start. None of these
 * facts can change unless the file itself does, so they are reused whenever the
 * built derivative is newer than the original, which is the same freshness
 * check the encoder uses. Replace a file in place and it gets read again.
 *
 * The capture time is not stored, only used to order new photos within a day,
 * and photos already in the manifest keep the slug they were given.
 */
const reusable = (file) => {
  const kept = prior.get(file)
  if (!kept?.slug || !kept.width || !kept.height || !kept.date) return null
  const src = path.join(ORIGINALS, file)
  const built = path.join(DERIVATIVES, `${kept.slug}-400.webp`)
  if (!existsSync(built) || statSync(built).mtimeMs < statSync(src).mtimeMs) return null
  return { file, width: kept.width, height: kept.height, date: kept.date, time: '00:00:00' }
}

/*
 * The originals are gitignored, so any checkout without them, CI included,
 * would otherwise scan an empty directory and write an empty manifest. This
 * runs from a build hook now, so that has to be impossible rather than
 * unlikely.
 */
const available = existsSync(ORIGINALS) ? readdirSync(ORIGINALS).filter((f) => /\.(jpe?g)$/i.test(f)) : []

if (available.length === 0) {
  console.log(`no originals in ${ORIGINALS}, leaving ${MANIFEST} untouched`)
  process.exit(0)
}

let read = 0
const scanned = available
  .map((file) => {
    const cached = reusable(file)
    if (cached) return cached

    read++
    const [w, h, exifDate] = identify(path.join(ORIGINALS, file))
    // EXIF dates use colons throughout: "2026:08:11 18:37:02"
    const stamp = (exifDate ?? '').trim()
    const date = stamp.slice(0, 10).replace(/:/g, '-') || '0000-00-00'
    const time = stamp.slice(11) || '00:00:00'
    return { file, width: Number(w), height: Number(h), date, time }
  })
  // Chronological, so slug numbering follows the order they were taken.
  .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`) || a.file.localeCompare(b.file))

// Slugs are public URLs, cached for a month, so once assigned they must never
// move. A photo dropped in later but taken earlier the same day would otherwise
// take `-01` and renumber everything already published under that date.
const taken = new Set(scanned.map((p) => prior.get(p.file)?.slug).filter(Boolean))
const nextSlug = (date) => {
  for (let n = 1; ; n++) {
    const slug = `${date}-${String(n).padStart(2, '0')}`
    if (!taken.has(slug)) {
      taken.add(slug)
      return slug
    }
  }
}

const photos = scanned.map((p) => {
  const kept = prior.get(p.file) ?? {}
  return {
    file: p.file,
    slug: kept.slug ?? nextSlug(p.date),
    date: p.date,
    width: p.width,
    height: p.height,
    // The fields that need a human. Preserved across runs.
    location: kept.location ?? '',
    ...(kept.collection ? { collection: kept.collection } : {}),
    ...(kept.caption ? { caption: kept.caption } : {}),
    ...(kept.hidden ? { hidden: kept.hidden } : {}),
  }
})

/*
 * The array order is the order the wall displays, and it is arranged by hand
 * in the add-photos tool, so it has to survive a rescan. Photos already in the
 * manifest keep their position and anything new lands at the end, where it is
 * easy to find and move.
 */
const position = new Map((previous.photos ?? []).map((p, i) => [p.file, i]))
const ordered = [
  ...photos.filter((p) => position.has(p.file)).sort((a, b) => position.get(a.file) - position.get(b.file)),
  ...photos.filter((p) => !position.has(p.file)),
]

/*
 * Collections are named and ordered by hand in the add-photos tool, and the
 * photos point at them by id. They are carried straight through: a rescan
 * knows nothing about them and must not be able to drop one.
 */
const collections = previous.collections ?? []

writeFileSync(MANIFEST, JSON.stringify({ collections, photos: ordered }, null, 2) + '\n')

const unlabelled = photos.filter((p) => !p.location).length
const unfiled = photos.filter((p) => !p.collection).length
if (unfiled) console.log(`${unfiled} not in a collection yet`)
console.log(`${photos.length} photos -> ${MANIFEST} (read ${read}, reused ${photos.length - read})`)
console.log(
  unlabelled
    ? `${unlabelled} still need a location. Run \`npm run add-photos\` to fill them in.`
    : 'all photos have a location',
)
