import { useState } from 'react'

/**
 * Full-bleed hero photograph. The image fades in once decoded, which avoids the
 * flash of an empty backdrop without blocking the rest of the page behind a
 * loading overlay.
 */
export const Backdrop = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="bg-surface-950 fixed inset-0 -z-10" aria-hidden="true">
      <img
        src="/carbondale.jpg"
        alt=""
        fetchPriority="high"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-1000 ease-(--ease-out-soft) ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="bg-surface-950/55 absolute inset-0 backdrop-blur-[6px]" />
    </div>
  )
}
