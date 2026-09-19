#!/usr/bin/env node
/**
 * The way photos get added to the site.
 *
 * Run `npm run add-photos` after dropping files into photos/originals. This
 * picks them up, builds the web derivatives, then serves a page for typing in
 * each photo's location, saving straight back to photos/manifest.json.
 *
 * It is a local server rather than a file you open directly because a page
 * loaded over file:// cannot write to disk, and typing labels into a page that
 * then asks you to copy JSON somewhere is how labels get lost.
 */
import { execFile, execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 4321)
const MANIFEST = 'photos/manifest.json'
const DERIVATIVES = 'public/photos'
const PAGE = path.join(import.meta.dirname, 'index.html')

const pipeline = () => {
  execFileSync('node', ['scripts/photos-manifest.mjs'], { stdio: 'inherit' })
  execFileSync('node', ['scripts/photos-build.mjs'], { stdio: 'inherit' })
}

const readManifest = () => JSON.parse(readFileSync(MANIFEST, 'utf8'))

/**
 * Only the fields a human owns are taken from the page. Everything else is
 * derived from the original file, so a stale tab cannot overwrite a slug or a
 * capture date with whatever it happened to be holding.
 */
const saveLabels = (incoming, incomingCollections) => {
  const edits = new Map(incoming.map((p) => [p.file, p]))
  const manifest = readManifest()
  let changed = 0

  for (const photo of manifest.photos) {
    const edit = edits.get(photo.file)
    if (!edit) continue
    const location = String(edit.location ?? '').trim()
    if (location !== (photo.location ?? '')) {
      photo.location = location
      changed++
    }
    const collection = String(edit.collection ?? '').trim()
    if (collection !== (photo.collection ?? '')) {
      if (collection) photo.collection = collection
      else delete photo.collection
      changed++
    }
  }

  /*
   * Collections are only replaced when the page sends them, so a client that
   * knows nothing about them cannot wipe the list. Ids are the join key with
   * the photos above, so they are taken as given; only the title and the
   * order are editable.
   */
  let collectionsChanged = false
  if (Array.isArray(incomingCollections)) {
    const next = incomingCollections
      .filter((c) => c && typeof c.id === 'string' && c.id.trim())
      .map((c) => ({
        id: c.id.trim(),
        title: String(c.title ?? '').trim() || c.id.trim(),
      }))
    if (JSON.stringify(next) !== JSON.stringify(manifest.collections ?? [])) {
      manifest.collections = next
      collectionsChanged = true
    }
  }

  /*
   * The array order is the order the wall displays, so it is saved too. Only
   * when the page is holding exactly the same set of photos: a tab left open
   * across a rescan would otherwise drop whatever it had not heard about.
   */
  const incomingFiles = incoming.map((p) => p.file)
  const sameSet =
    incomingFiles.length === manifest.photos.length &&
    new Set(incomingFiles).size === incomingFiles.length &&
    incomingFiles.every(
      (file) => edits.has(file) && manifest.photos.some((p) => p.file === file),
    )

  let reordered = false
  if (sameSet) {
    const byFile = new Map(manifest.photos.map((p) => [p.file, p]))
    const next = incomingFiles.map((file) => byFile.get(file))
    if (next.some((photo, i) => photo !== manifest.photos[i])) {
      manifest.photos = next
      reordered = true
    }
  }

  if (changed || reordered || collectionsChanged) {
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  }
  return {
    changed,
    reordered,
    collectionsChanged,
    total: manifest.photos.length,
    orderSaved: sameSet,
  }
}

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

console.log('Scanning photos/originals and building derivatives...')
pipeline()

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/' && req.method === 'GET') {
    return send(res, 200, readFileSync(PAGE), 'text/html; charset=utf-8')
  }

  if (url.pathname === '/api/photos' && req.method === 'GET') {
    const manifest = readManifest()
    return send(res, 200, JSON.stringify(manifest))
  }

  if (url.pathname === '/api/photos' && req.method === 'PUT') {
    try {
      const { photos, collections } = JSON.parse(await readBody(req))
      if (!Array.isArray(photos)) throw new Error('Expected a photos array')
      return send(res, 200, JSON.stringify(saveLabels(photos, collections)))
    } catch (error) {
      return send(
        res,
        400,
        JSON.stringify({ error: String(error.message ?? error) }),
      )
    }
  }

  if (url.pathname === '/api/rebuild' && req.method === 'POST') {
    try {
      pipeline()
      return send(res, 200, JSON.stringify({ ok: true }))
    } catch (error) {
      return send(
        res,
        500,
        JSON.stringify({ error: String(error.message ?? error) }),
      )
    }
  }

  // The site's own icon, so the browser's automatic request is not a 404 in
  // the console.
  if (url.pathname === '/favicon.svg' || url.pathname === '/favicon.ico') {
    return send(res, 200, readFileSync('public/favicon.svg'), 'image/svg+xml')
  }

  // Thumbnails, straight from the built derivatives.
  if (url.pathname.startsWith('/photos/') && req.method === 'GET') {
    const file = path.join(DERIVATIVES, path.basename(url.pathname))
    if (!existsSync(file)) return send(res, 404, '{}')
    return send(res, 200, readFileSync(file), 'image/webp')
  }

  send(res, 404, '{}')
})

/** Opens the page in whatever the platform considers the default browser. */
const openBrowser = (url) => {
  const command =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'explorer'
        : 'xdg-open'
  // Detached and unreferenced, so a browser that stays open does not hold the
  // server process alive, and a machine with no opener just carries on.
  try {
    const child = execFile(command, [url], { stdio: 'ignore' })
    child.unref?.()
    child.on?.('error', () => {})
  } catch {
    // Nothing to open with. The URL is printed either way.
  }
}

/*
 * A busy port is the likeliest failure here, usually a copy already running in
 * another terminal, and the default for it is an unhandled 'error' event and a
 * stack trace. Say what happened and what to do instead.
 */
server.on('error', (error) => {
  if (error.code !== 'EADDRINUSE') throw error
  console.error(`\n  Port ${PORT} is already in use.\n`)
  console.error(
    `  If add-photos is already running, open http://localhost:${PORT}`,
  )
  console.error(
    `  Otherwise start it on another port:  PORT=${PORT + 1} npm run add-photos\n`,
  )
  process.exit(1)
})

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  const { photos } = readManifest()
  const unlabelled = photos.filter((p) => !p.location).length

  const unfiled = photos.filter((p) => !p.collection).length

  console.log(
    `\n  ${photos.length} photos, ${unlabelled} still needing a location`,
  )
  if (unfiled) console.log(`  ${unfiled} not in a collection`)
  console.log(`\n  →  ${url}\n`)
  console.log('  Labels save as you type. Ctrl+C when you are done.\n')

  if (process.env.NO_OPEN) return
  openBrowser(url)
})
