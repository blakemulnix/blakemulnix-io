import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Photo } from './types'

interface SlideShowModalProps {
  isOpen: boolean
  onClose: () => void
  photos: Photo[]
  currentPhotoIndex: number
  onPrevious: () => void
  onNext: () => void
}

const SlideShowModal = ({ isOpen, onClose, photos, currentPhotoIndex, onPrevious, onNext }: SlideShowModalProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
  }, [currentPhotoIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        onNext()
      } else if (e.key === 'ArrowLeft') {
        onPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Prefetch next image
  const nextIndex = (currentPhotoIndex + 1) % photos.length

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-[10px] z-50 flex flex-col items-center justify-center text-lg md:text-3xl"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white p-3 hover:text-gray-300 z-[60]"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ✕
      </button>

      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className="relative w-full h-full ">
          <Image
            src={photos[currentPhotoIndex].originalUrl}
            alt={photos[currentPhotoIndex].title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1920px"
            quality={75}
            className={`object-contain cursor-pointer ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setIsLoading(false)}
            onClick={onNext}
          />
        </div>

        {/* Prefetch next image */}
        <div className="hidden">
          <Image
            src={photos[nextIndex].originalUrl}
            alt={photos[nextIndex].title}
            fill
            sizes="(max-width: 768px) 100vw, 1920px"
            quality={75}
          />
        </div>
      </div>

      <div className="text-white flex items-center gap-4 lg:gap-6" onClick={(e) => e.stopPropagation()}>
        <button className="p-4 hover:text-gray-300" onClick={onPrevious}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <span>
          {currentPhotoIndex + 1} / {photos.length}
        </span>

        <button className="p-4 hover:text-gray-300" onClick={onNext}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SlideShowModal
