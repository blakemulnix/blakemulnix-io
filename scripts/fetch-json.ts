import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "path";

const s3Client = new S3Client({ region: "us-east-1" });

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

async function downloadJsonObjects(bucketName: string, keys: string[]): Promise<object[]> {
  const jsonObjects: object[] = [];

  for (const key of keys) {
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

async function fetchJsonFiles() {
  const bucketName = "blakemulnix-blogposts-wawcqdgwdevwdpdjrsxy";
  const objectKeys = await listObjects(bucketName);
  const jsonObjects = await downloadJsonObjects(bucketName, objectKeys);

  console.log("JSON objects:", JSON.stringify(jsonObjects, null, 2));
}

fetchJsonFiles();
