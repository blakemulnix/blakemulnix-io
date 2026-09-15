import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import '@fontsource-variable/fraunces/standard.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Unable to mount the application: #root was not found.')
}

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The build prerenders markup into #root, so adopt it rather than discarding
// it. Falls back to a fresh render when that markup is absent.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree)
} else {
  createRoot(rootElement).render(tree)
}
