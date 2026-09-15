import { useEffect, useState } from 'react'

import { DesignPicker } from './components/DesignPicker'
import { profile } from './data/about'
import { designs } from './designs'

const readDesignId = () => window.location.hash.replace(/^#\/?/, '')

/**
 * Hash-routed gallery for comparing designs, and the only thing that imports
 * the parked ones.
 *
 * It lives in its own module so the production build can drop it: App reaches
 * it through a dynamic import behind `import.meta.env.DEV`, which Rollup
 * resolves at build time. A static import would keep every parked design in
 * the shipped bundle, because the registry array would still be reachable.
 */
export const DesignGallery = () => {
  const [id, setId] = useState(readDesignId)

  useEffect(() => {
    const onHashChange = () => {
      setId(readDesignId())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const current = designs.find((d) => d.id === id) ?? designs[0]
  if (!current) throw new Error('No designs are registered.')

  useEffect(() => {
    document.title = `${profile.name}, ${profile.role} · ${current.name}`
  }, [current.name])

  const Design = current.Component
  return (
    <>
      <Design key={current.id} />
      <DesignPicker designs={designs} current={current} />
    </>
  )
}

export default DesignGallery
