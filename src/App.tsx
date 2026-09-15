import { useEffect, useState } from 'react'

import { DesignPicker } from './components/DesignPicker'
import { profile } from './data/about'
import { designs } from './designs'

const readDesignId = () => window.location.hash.replace(/^#\/?/, '')

export const App = () => {
  const [id, setId] = useState(readDesignId)

  useEffect(() => {
    const onHashChange = () => {
      setId(readDesignId())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const fallback = designs[0]
  const current = designs.find((d) => d.id === id) ?? fallback
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
