import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SSR_BUNDLE = 'dist/.ssr/entry-server.js'
const INDEX = 'dist/index.html'
const PLACEHOLDER = '<div id="root"></div>'
const ORIGIN = 'https://blakemulnix.io'

const { render, routeMeta, routePaths } = await import(
  pathToFileURL(SSR_BUNDLE).href
)

const template = readFileSync(INDEX, 'utf8')
if (!template.includes(PLACEHOLDER)) {
  throw new Error(
    `Could not find ${PLACEHOLDER} in ${INDEX}; prerender would be silently skipped.`,
  )
}

/**
 * A document per route, so a link to a section or a photo album is a real
 * page: served with its own markup, indexed on its own, and hydrated without
 * the landing view flashing first.
 *
 * `/x` is written as `x/index.html`. CloudFront rewrites extensionless paths
 * to that key, which is also what most static hosts do by default.
 */
const destination = (route) =>
  route === '/' ? INDEX : path.join('dist', route.slice(1), 'index.html')

/**
 * The head is templated by replacing whole tags rather than by string
 * interpolation into a template, so the one in index.html stays the single
 * copy and a tag that gets renamed here fails loudly instead of silently
 * leaving the default behind.
 */
const retitle = (html, { title, description, url }) => {
  // Tested rather than compared before and after: the home route's title is
  // the one already in the template, so an unchanged string means "matched
  // and identical" just as often as it means "no match at all".
  const swap = (pattern, replacement) => {
    if (!pattern.test(html))
      throw new Error(`prerender: nothing matched ${pattern} in ${INDEX}`)
    html = html.replace(pattern, replacement)
  }

  swap(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  for (const attr of ['property="og:title"', 'name="twitter:title"']) {
    swap(new RegExp(`(<meta ${attr} content=")[^"]*"`), `$1${title}"`)
  }
  swap(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
  for (const [attr, flags] of [
    ['name="description"', ''],
    ['property="og:description"', ''],
    ['name="twitter:description"', ''],
  ]) {
    swap(
      new RegExp(`(<meta\\s+${attr}\\s+content=\\s*")[^"]*"`, flags),
      `$1${description}"`,
    )
  }
  return html
}

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

let total = 0
for (const route of routePaths()) {
  const markup = render(route)
  // Title and description come from the app's own data, so they cannot drift.
  const meta = routeMeta(route)
  const html = retitle(template, {
    title: escape(meta.title),
    description: escape(meta.description),
    url: `${ORIGIN}${route}`,
  }).replace(PLACEHOLDER, `<div id="root">${markup}</div>`)

  const out = destination(route)
  mkdirSync(path.dirname(out), { recursive: true })
  writeFileSync(out, html)
  total += Buffer.byteLength(markup, 'utf8')
  console.log(`  ${route} -> ${out}`)
}

/*
 * The sitemap is generated from the same route list, rather than kept as a
 * static file listing only the home page. Photo albums are the whole reason
 * this matters: they are real pages now, and a crawler has no way to discover
 * one otherwise, since reaching it means clicking.
 */
writeFileSync(
  'dist/sitemap.xml',
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routePaths().map((route) =>
      [
        '  <url>',
        `    <loc>${ORIGIN}${route}</loc>`,
        '    <changefreq>monthly</changefreq>',
        `    <priority>${route === '/' ? '1.0' : '0.7'}</priority>`,
        '  </url>',
      ].join('\n'),
    ),
    '</urlset>',
    '',
  ].join('\n'),
)

// The server bundle is a build artefact, not something to publish.
rmSync('dist/.ssr', { recursive: true, force: true })

console.log(
  `prerendered ${routePaths().length} routes (and dist/sitemap.xml), ${total.toLocaleString()} bytes of markup`,
)
