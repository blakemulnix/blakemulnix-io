import React from 'react'
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "next/image";
import { Config } from "sst/node/config";

async function getFileFromS3(s3Client: S3Client, bucketName: string, objectKey: string): Promise<any> {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      })
    );

    if (!response.Body) {
      return null;
    }

    const fileContent = response.Body.transformToString();

    return fileContent;
  } catch (error) {
    console.error("Error getting file from S3:", error);
    return null;
  }
}

async function getImageUrlFromS3(s3Client: S3Client, bucketName: string, objectKey: string): Promise<string | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes

    return signedUrl;
  } catch (error) {
    console.error("Error getting image URL from S3:", error);
    return null;
  }
}

export default async function Home() {
  const region = Config.AWS_REGION;
  const awsCredentials = {
    accessKeyId: Config.AWS_ACCESS_KEY_ID,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
  }

  const s3Client = new S3Client({
    region: region,
    credentials: awsCredentials
  });

  const bucketName = "test-blog-site-blogpostsbucketbbaf6d0f-rfwphopaugeu";
  const filename = "textfile.txt";
  const imageName = "carbondale.jpg";
  const content = await getFileFromS3(s3Client, bucketName, filename);
  const imageUrl = await getImageUrlFromS3(s3Client, bucketName, imageName);

  console.log(Config.NEW_SECRET)

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Coming Soon!</h1>
        <p className="text-stone-600 mb-8">Stay tuned!</p>
        <p>{content}</p>
        {imageUrl ? <Image src={imageUrl} width={500} height={500} alt="Carbondale, CO" /> : <p>Loading image...</p>}
      </div>
    </main>
  );
}
