import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
