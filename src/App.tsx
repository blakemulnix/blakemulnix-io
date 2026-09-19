import { Suspense, lazy } from 'react'

import { Rail } from './designs/Rail'

/*
 * The design that ships, imported directly.
 *
 * The review gallery is reached through a dynamic import that only exists in
 * the development branch, so `vite build` drops it along with every parked
 * design. Importing the registry here instead would ship all of them.
 */
const DesignGallery = import.meta.env.DEV
  ? lazy(() => import('./DesignGallery'))
  : null

export const App = () =>
  DesignGallery ? (
    <Suspense fallback={null}>
      <DesignGallery />
    </Suspense>
  ) : (
    <Rail />
  )
