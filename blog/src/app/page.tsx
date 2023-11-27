import React from 'react'
import Image from "next/image";
import { downloadBlogPostData, getFileFromS3, getImageUrlFromS3 } from './services/s3';
import { Config } from "sst/node/config";

export default async function Home() {
  const bucketName = Config.BLOGPOST_BUCKET_NAME;
  const filename = "textfile.txt";
  const imageName = "carbondale.jpg";
  const content = await getFileFromS3(bucketName, filename);
  const imageUrl = await getImageUrlFromS3(bucketName, imageName);
  const blogPostData: any = await downloadBlogPostData(bucketName);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Coming Soon!</h1>
        <p className="text-stone-600 mb-8">Stay tuned!</p>
        <p>{content}</p>
        {imageUrl ? <Image src={imageUrl} width={500} height={500} alt="Carbondale, CO" /> : <p>Loading image...</p>}

        {blogPostData.map((blogPost: any) => (
          <div key={blogPost.postId}>
            <p>ID: {blogPost.postId}</p>
            <p>Title: {blogPost.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}