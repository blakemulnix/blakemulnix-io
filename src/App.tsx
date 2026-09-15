import { useEffect, useState } from 'react'

import { DesignPicker } from './components/DesignPicker'
import { profile } from './data/about'
import { designs } from './designs'

/** The design that ships. The switcher below is a local review tool only. */
const PRODUCTION_DESIGN = 'scroll'

const readDesignId = () => window.location.hash.replace(/^#\/?/, '')

/**
 * Hash-routed gallery for comparing designs. Development only, so the review
 * chrome never reaches production and prerendered markup stays deterministic.
 */
const DesignGallery = () => {
  const [id, setId] = useState(readDesignId)

  useEffect(() => {
    const onHashChange = () => {
      setId(readDesignId())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const current = designs.find((d) => d.id === id) ?? designs[0]
  if (!current) throw new Error('No designs are registered.')

  useEffect(() => {
    document.title = `${profile.name} — ${profile.role} · ${current.name}`
  }, [current.name])

  const Design = current.Component
  return (
    <>
      <Design key={current.id} />
      <DesignPicker designs={designs} current={current} />
    </>
  )
}

const chosen = designs.find((d) => d.id === PRODUCTION_DESIGN)
if (!chosen) throw new Error(`Unknown production design: ${PRODUCTION_DESIGN}`)
const ProductionDesign = chosen.Component

export const App = () => (import.meta.env.DEV ? <DesignGallery /> : <ProductionDesign />)
