import { renderToString } from 'react-dom/server'

import { App } from './App'

/**
 * Renders the production markup injected into dist/index.html at build time,
 * so crawlers and first paint get real content rather than an empty root.
 */
export function render(): string {
  return renderToString(<App />)
}
