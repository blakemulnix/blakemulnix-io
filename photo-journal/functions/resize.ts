import Sharp from 'sharp';
import { S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const handler: S3Handler = async (event) => {
  const s3 = new S3Client({});
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  try {
    // Get the original image
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }));

    if (!Body) {
      throw new Error('No image data received');
    }

    // Convert stream to buffer
    const buffer = await streamToBuffer(Body as any);

    // Resize to thumbnail
    const resized = await Sharp(buffer)
      .resize(300, 200, { fit: 'cover' })
      .toBuffer();

    const thumbnailKey = key.replace('original.jpg', 'thumbnail.jpg');

    // Upload thumbnail
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: thumbnailKey,
      Body: resized,
      ContentType: 'image/jpeg',
      Metadata: {
        thumbnail: 'true',
        sourceImage: key,
      },
    }));

    console.log(`Successfully created thumbnail: ${thumbnailKey}`);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// Helper function to convert stream to buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}