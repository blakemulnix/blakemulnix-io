import { renderToString } from 'react-dom/server'

import { App } from './App'
import { setServerRoute } from './routes'

/**
 * Renders the production markup injected into each prerendered document, so
 * crawlers and first paint get real content rather than an empty root.
 *
 * One document per route: the route is set before rendering and read through
 * the same store the browser uses, so /outside/canyon-country ships that
 * album's markup and hydrates without a mismatch.
 */
export function render(pathname = '/'): string {
  setServerRoute(pathname)
  return renderToString(<App />)
}

export { routeMeta, routePaths } from './routePaths'
