import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extname } from "path";
import { Config } from "sst/node/config";

const region = Config.AWS_REGION;
const awsCredentials = {
  accessKeyId: Config.AWS_ACCESS_KEY_ID,
  secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client({
  region: region,
  credentials: awsCredentials,
});

export async function getFileFromS3(bucketName: string, objectKey: string): Promise<any> {
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

export async function getImageUrlFromS3(bucketName: string, objectKey: string): Promise<string | null> {
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

async function listObjects(bucketName: string): Promise<string[]> {
  try {
    const listParams = {
      Bucket: bucketName,
    };

    const response = await s3Client.send(new ListObjectsCommand(listParams));
    return response.Contents?.map((object) => object.Key || "") || [];
  } catch (error) {
    console.error(`Error listing objects for bucket: ${bucketName}`, error);
    return [];
  }
}

export async function downloadBlogPostData(bucketName: string): Promise<object[]> {
  const objectKeys = await listObjects(bucketName);
  const jsonObjects: object[] = [];

  for (const key of objectKeys) {
    const ext = extname(key).toLowerCase();
    if (ext !== ".json") {
      continue;
    }

    const keyParts = key.split("/");
    const postId = keyParts.length > 1 ? keyParts[0] : key;

    const downloadParams = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const response = await s3Client.send(new GetObjectCommand(downloadParams));
      const fileContent = await response.Body?.transformToString();

      if (fileContent) {
        const jsonContent = JSON.parse(fileContent);
        jsonObjects.push({ postId, ...jsonContent });
        console.log(`JSON file ${key} downloaded successfully.`);
      }
    } catch (error) {
      console.error(`Error downloading JSON object ${key}:`, error);
    }
  }
  return jsonObjects;
}
