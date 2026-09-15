import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SSR_BUNDLE = 'dist/.ssr/entry-server.js'
const INDEX = 'dist/index.html'
const PLACEHOLDER = '<div id="root"></div>'

const { render } = await import(pathToFileURL(SSR_BUNDLE).href)
const markup = render()

const html = readFileSync(INDEX, 'utf8')
if (!html.includes(PLACEHOLDER)) {
  throw new Error(`Could not find ${PLACEHOLDER} in ${INDEX}; prerender would be silently skipped.`)
}

writeFileSync(INDEX, html.replace(PLACEHOLDER, `<div id="root">${markup}</div>`))

// The server bundle is a build artefact, not something to publish.
rmSync('dist/.ssr', { recursive: true, force: true })

const bytes = Buffer.byteLength(markup, 'utf8')
console.log(`prerendered ${bytes.toLocaleString()} bytes of markup into ${INDEX}`)
