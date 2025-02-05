import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import collections from '../photos/collections.json'

interface Photo {
  title: string
  filename: string
}

interface Collection {
  title: string
  description: string
  date: string
  directory: string
  photos: Photo[]
}

async function main() {
  // Get the values from process.env
  const bucketName = process.env.BUCKET_NAME
  const region = process.env.REGION || 'us-east-1'

  if (!bucketName) {
    throw new Error('BUCKET_NAME environment variable is not set')
  }

  console.log(`Running upload script for bucket: ${bucketName} in ${region}`)

  const s3Client = new S3Client({ region })
  
  try {
    const photosBaseDir = join(process.cwd(), 'photos')
    
    // Process each collection
    for (const collection of collections as Collection[]) {
      const collectionDir = join(photosBaseDir, collection.directory)
      console.log(`Processing collection: ${collection.title} from ${collectionDir}`)

      // Upload each photo in the collection
      for (const photo of collection.photos) {
        const filePath = join(collectionDir, photo.filename)
        
        try {
          const fileContent = await readFile(filePath)
          await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: `${collection.directory}/${photo.filename.replace('.jpg', '.original.jpg')}`,
            Body: fileContent,
            ContentType: 'image/jpeg'
          }))
          
          console.log(`Uploaded ${photo.filename}.original.jpg for collection ${collection.title}`)
        } catch (err) {
          console.error(`Error processing ${photo.filename}:`, err)
        }
      }
    }

    console.log('Upload complete!')
  } catch (err) {
    console.error("Error", err)
  }
}

main().catch(console.error)