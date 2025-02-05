import { NextResponse } from 'next/server';
import collections from '../../../../photos/collections.json';

export async function GET(request: Request) {
  const cloudfrontUrl = process.env.CLOUDFRONT_URL;
  if (!cloudfrontUrl) {
    console.error('CLOUDFRONT_URL parameter is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const collectionsWithUrls = collections.map(collection => ({
      ...collection,
      photos: collection.photos.map(photo => ({
        ...photo,
        thumbnailUrl: `https://${cloudfrontUrl}/${collection.directory}/${photo.filename.replace('.jpg', '.thumbnail.jpg')}`,
        originalUrl: `https://${cloudfrontUrl}/${collection.directory}/${photo.filename.replace('.jpg', '.original.jpg')}`
      }))
    }));

    return NextResponse.json({ collections: collectionsWithUrls });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}