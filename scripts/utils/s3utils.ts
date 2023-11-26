import { CloudFormationClient, DescribeStacksCommand, DescribeStacksCommandInput } from "@aws-sdk/client-cloudformation";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import { promisify } from "util";

const region = "us-east-1";

export async function getBucketNameFromStack(stackName: string, bucketNameOutputKey: string): Promise<string | undefined> {
  const cloudFormationClient = new CloudFormationClient({ region });

  try {
    const describeStacksParams: DescribeStacksCommandInput = { StackName: stackName };
    const response = await cloudFormationClient.send(new DescribeStacksCommand(describeStacksParams));

    const stack = response.Stacks?.[0];
    const outputs = stack?.Outputs;

    if (outputs) {
      const bucketOutput = outputs.find((output) => output.OutputKey === bucketNameOutputKey);

      if (bucketOutput) {
        return bucketOutput.OutputValue;
      } else {
        console.log("No 'BucketName' output found in the stack.");
      }
    } else {
      console.log("No outputs found in the stack.");
    }
  } catch (error) {
    console.error("Error getting bucket name from stack:", error);
  }
}

export async function uploadFileToS3(bucketName: string, objectKey: string, objectBody: any): Promise<void> {
  const s3Client = new S3Client({ region });

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: objectBody,
      })
    );

    console.log("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
}

export async function getFileFromS3(bucketName: string, objectKey: string): Promise<any> {
  const s3Client = new S3Client({ region });

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

export async function uploadImageToS3(bucketName: string, objectKey: string, filepath: string, contentType: string): Promise<void> {
  const s3Client = new S3Client({ region });

  const imageBody = await readImageFileToBuffer(filepath);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: imageBody,
        ContentType: contentType,
      })
    );

    console.log("Image uploaded successfully!");
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
}

export async function getImageFromS3(bucketName: string, objectKey: string): Promise<Buffer | null> {
  const s3Client = new S3Client({ region });

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

    const imageData = await streamToBuffer(response.Body);

    return imageData;
  } catch (error) {
    console.error("Error getting image from S3:", error);
    return null;
  }
}

export async function getImageUrlFromS3(bucketName: string, objectKey: string): Promise<string | null> {
  const s3Client = new S3Client({ region });

  try {
    // Get a signed URL for the image
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

const readFileAsync = promisify(fs.readFile);

async function readImageFileToBuffer(filePath: string): Promise<Buffer> {
  try {
    const buffer = await readFileAsync(filePath);
    return buffer;
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
