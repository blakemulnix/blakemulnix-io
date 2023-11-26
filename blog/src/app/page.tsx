import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function getFileFromS3(bucketName: string, objectKey: string): Promise<any> {
  const region = "us-east-1";
  const s3Client = new S3Client({ 
    region
  });

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

export default function Home() {
  const bucketName = "test-blog-site-blogpostsbucketbbaf6d0f-rfwphopaugeu";
  const filename = "textfile.txt";
  const content = getFileFromS3(bucketName, filename);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Coming Soon!</h1>
        <p className="text-stone-600 mb-8">Stay tuned!</p>
        <p>{content}</p>
      </div>
    </main>
  );
}
