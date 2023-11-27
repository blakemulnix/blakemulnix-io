import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.BLOGPOST_BUCKET_NAME;
const localBaseDirectory = "../blogposts";

async function uploadDirectory(localDirectory: string, s3Prefix: string = "") {
  try {
    const files = readdirSync(localDirectory);

    for (const file of files) {
      const filePath = join(localDirectory, file);
      const s3Key = join(s3Prefix, file);

      if (statSync(filePath).isDirectory()) {
        await uploadDirectory(filePath, s3Key);
      } else {
        const fileContent = readFileSync(filePath);

        const uploadParams = {
          Bucket: bucketName,
          Key: s3Key,
          Body: fileContent,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`File ${s3Key} uploaded successfully.`);
      }
    }
  } catch (error) {
    console.error(`Error uploading directory ${localDirectory}:`, error);
  }
}

uploadDirectory(localBaseDirectory);