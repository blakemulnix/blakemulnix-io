import React from 'react'
import Image from 'next/image'
import { Collection } from './types'

interface PhotoListItemProps {
  collection?: Collection
  onClick?: (collection: Collection) => void
  isLoading?: boolean
}

const PhotoListItem = ({ collection, onClick, isLoading = false }: PhotoListItemProps) => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const loadedImages = React.useRef(new Set<string>());

  React.useEffect(() => {
    setImagesLoaded(false);
    loadedImages.current.clear();
  }, [collection]);

  const handleImageLoad = async (photoUrl: string) => {
    loadedImages.current.add(photoUrl);
    if (collection && loadedImages.current.size === Math.min(3, collection.photos.length)) {
      setImagesLoaded(true);
    }
  };

  const renderContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-2">{collection?.title}</h2>
      <p className="mb-2">{collection?.date}</p>
      <p className="mb-4">{collection?.description}</p>

      <div className="grid grid-cols-3 gap-4">
        {collection?.photos.slice(0, 3).map((photo, photoIndex) => (
          <div key={photoIndex} className="aspect-square relative">
            <Image 
              src={photo.thumbnailUrl} 
              alt={photo.title} 
              fill 
              className={`object-cover rounded-lg transition-opacity duration-300 ${!imagesLoaded ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => handleImageLoad(photo.thumbnailUrl)}
            />
            {!imagesLoaded && (
              <div
                className="absolute inset-0 bg-stone-600/60 rounded-lg animate-pulse"
                style={{
                  animationDelay: `${800 + photoIndex * 200}ms`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="rounded-lg p-6 backdrop-blur-[10px] bg-stone-950/40">
        <div className="h-8 w-[85%] bg-stone-600/60 rounded-md animate-pulse [animation-delay:0ms] mb-2" />
        <div className="h-4 w-[20%] bg-stone-600/60 rounded animate-pulse [animation-delay:200ms] mb-3" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-[95%] bg-stone-600/60 rounded animate-pulse [animation-delay:400ms]" />
          <div className="h-4 w-[88%] bg-stone-600/60 rounded animate-pulse [animation-delay:600ms]" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="aspect-square relative">
              <div
                className="absolute inset-0 bg-stone-600/60 rounded-lg animate-pulse [animation-delay:800ms]"
                style={{
                  animationDelay: `${800 + index * 200}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg p-6 backdrop-blur-[10px] bg-stone-950/40 cursor-pointer"
      onClick={() => collection && onClick?.(collection)}
    >
      {renderContent()}
    </div>
  )
}

export default PhotoListItem
