/**
 * Renders the one page CV to resume/out/blake-mulnix-cv.pdf.
 *
 * Typesetting is Typst's, driven through its Python wheel, so there is a real
 * typesetting engine doing the line breaking and vertical rhythm and no TeX
 * distribution to install. The layout is resume/cv.typ, which echoes the site:
 * same three faces, same palette, same accent rule down each entry, and the
 * technology pills moved into a column beside each role rather than under it.
 *
 * Content is resume/content.yaml, deliberately not the site's prose. The site
 * has room to explain; a CV has one page and a reader who is skimming.
 *
 * First run creates a virtualenv under scripts/resume/ and converts the fonts,
 * which takes a moment. After that a render is well under a second.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const venv = path.join(root, 'scripts/resume/.venv')
const python = path.join(venv, 'bin/python')
const source = path.join(root, 'resume/cv.typ')
const out = path.join(root, 'resume/out/blake-mulnix-cv.pdf')

const run = (cmd, args, options) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit', ...options })

if (!existsSync(python)) {
  console.log('Setting up Typst (one time)...')
  run('python3', ['-m', 'venv', venv])
  run(path.join(venv, 'bin/pip'), ['install', '-q', '-r', path.join(root, 'scripts/resume/requirements.txt')])
}

run(python, [path.join(root, 'scripts/resume/assets.py'), root])
mkdirSync(path.dirname(out), { recursive: true })

run(python, [
  '-c',
  [
    'import typst, sys',
    `typst.compile(${JSON.stringify(source)}, output=${JSON.stringify(out)},`,
    '  font_paths=["scripts/resume/fonts"], root=".")',
  ].join('\n'),
])

/*
 * One page is the whole brief, so it is asserted rather than hoped for. Two
 * pages is otherwise a silent failure: the PDF still opens, and the overflow
 * only shows up if someone scrolls. An early draft of the layout ran to five
 * pages from a single bad height, which is how this check earned its place.
 */
const info = execFileSync('pdfinfo', [out], {
  encoding: 'utf8',
  // Poppler grumbles about an object type in Typst's output. Harmless.
  stdio: ['pipe', 'pipe', 'ignore'],
})
const pages = Number(info.match(/^Pages:\s+(\d+)/m)[1])
const size = Math.round(readFileSync(out).length / 1024)

console.log(`\n${path.relative(root, out)}: ${pages} page${pages === 1 ? '' : 's'}, ${size}KB`)
if (pages !== 1) {
  console.error(`\nThat is ${pages} pages. Trim resume/content.yaml, or tighten the sizes in resume/cv.typ.`)
  process.exit(1)
}
