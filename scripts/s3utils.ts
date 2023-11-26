import { CloudFormationClient, DescribeStacksCommand, DescribeStacksCommandInput } from "@aws-sdk/client-cloudformation";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

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
  
      const fileContent = response.Body.transformToString()
  
      return fileContent;
    } catch (error) {
      console.error("Error getting file from S3:", error);
      return null;
    }
  }