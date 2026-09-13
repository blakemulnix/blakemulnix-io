import '@fontsource-variable/inter/wght.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Unable to mount the application: #root was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
