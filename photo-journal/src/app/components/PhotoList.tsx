'use client'

import React, { useEffect, useState } from 'react'
import SlideShowModal from './SlideShowModal'
import PhotoListItem from './PhotoListItem'

interface Photo {
  title: string;
  filename: string;
  thumbnailUrl: string;
  originalUrl: string;
}

interface Collection {
  title: string;
  description: string;
  date: string;
  photosDir?: string;
  photos: Photo[];
}

const PhotoList = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to fetch collections');
        
        setCollections(data.collections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const openSlideShow = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentPhotoIndex(0);
    setIsSlideShowOpen(true);
  };

  const handleNext = () => {
    setCurrentPhotoIndex(prev => 
      prev === (selectedCollection?.photos.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? (selectedCollection?.photos.length || 1) - 1 : prev - 1
    );
  };

  if (loading) return (
    <div className="space-y-8 mb-16">
      {[1, 2, 3].map((_, index) => (
        <PhotoListItem key={index} isLoading={true} />
      ))}
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="space-y-8 mb-16">
        {collections.map((collection, index) => (
          <PhotoListItem
            key={index}
            collection={collection}
            onClick={openSlideShow}
          />
        ))}
      </div>

      <SlideShowModal
        isOpen={isSlideShowOpen}
        onClose={() => setIsSlideShowOpen(false)}
        photos={selectedCollection?.photos || []}
        currentPhotoIndex={currentPhotoIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};

export default PhotoList;
