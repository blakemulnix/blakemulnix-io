#!/usr/bin/env node
/**
 * Builds (or refreshes) photos/manifest.json from the originals.
 *
 * One flat entry per photo, each with its own location. Idempotent: locations
 * and captions you type are matched by filename and never overwritten, so
 * re-running only picks up newly dropped files and refreshes derived facts.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ORIGINALS = 'photos/originals'
const MANIFEST = 'photos/manifest.json'

const identify = (file) =>
  execFileSync('magick', ['identify', '-format', '%w\t%h\t%[EXIF:DateTimeOriginal]', file], {
    encoding: 'utf8',
  }).split('\t')

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { photos: [] }
const prior = new Map((previous.photos ?? []).map((p) => [p.file, p]))

const scanned = readdirSync(ORIGINALS)
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .map((file) => {
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
    ...(kept.caption ? { caption: kept.caption } : {}),
    ...(kept.hidden ? { hidden: kept.hidden } : {}),
  }
})

writeFileSync(MANIFEST, JSON.stringify({ photos }, null, 2) + '\n')

const unlabelled = photos.filter((p) => !p.location).length
console.log(`${photos.length} photos -> ${MANIFEST}`)
console.log(unlabelled ? `${unlabelled} still need a location` : 'all photos have a location')
