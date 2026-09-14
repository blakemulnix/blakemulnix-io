import { useEffect, useState } from 'react'

import { VariantPicker } from './components/VariantPicker'
import { profile } from './data/about'
import { variants } from './variants'

const readVariantId = () => window.location.hash.replace(/^#\/?/, '')

export const App = () => {
  const [id, setId] = useState(readVariantId)

  useEffect(() => {
    const onHashChange = () => {
      setId(readVariantId())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const fallback = variants[0]
  const current = variants.find((v) => v.id === id) ?? fallback

  if (!current) throw new Error('No design variants are registered.')

  useEffect(() => {
    document.title = `${profile.name} — ${profile.role} · ${current.name}`
  }, [current.name])

  const Design = current.Component

  return (
    <>
      <Design key={current.id} />
      <VariantPicker variants={variants} current={current} />
    </>
  )
}
