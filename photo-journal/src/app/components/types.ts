export interface Photo {
  title: string;
  filename: string;
  thumbnailUrl: string;
  originalUrl: string;
}

export interface Collection {
  title: string;
  description: string;
  date: string;
  photosDir?: string;
  photos: Photo[];
} 