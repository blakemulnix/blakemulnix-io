import { execFileSync } from 'node:child_process'

import type { Plugin } from 'vite'

/**
 * Regenerates src/data/*.generated.ts whenever content/*.yaml changes.
 *
 * The generated files are already imported by the app, so once they are
 * rewritten Vite's own watcher picks up the change and hot-reloads it same
 * as any other edit; this plugin's only job is to run the YAML -> TS step in
 * between. Runs once up front too, so a checkout with hand-edited YAML but a
 * stale generated file (or none) still serves the current content.
 */
export const contentWatch = (): Plugin => {
  const build = () => {
    try {
      execFileSync('node', ['scripts/content-build.mjs'], { stdio: 'inherit' })
    } catch {
      // The script already printed why. A broken YAML file should not crash
      // the dev server; it should keep serving the last good generated files
      // until the edit is fixed.
    }
  }

  return {
    name: 'content-watch',
    configureServer(server) {
      build()
      server.watcher.add('content')
      server.watcher.on('change', (file) => {
        // Chokidar reports this one as a path relative to the project root,
        // not absolute like everything else in the watcher, so a `/content/`
        // substring check (which works for the rest of the app) never
        // matched.
        if (/(^|[/\\])content[/\\]/.test(file)) build()
      })
    },
    buildStart() {
      build()
    },
  }
}
