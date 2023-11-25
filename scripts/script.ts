import {
    CloudFormationClient,
    DescribeStacksCommand,
    DescribeStacksCommandInput,
  } from "@aws-sdk/client-cloudformation";
  import {
    S3Client,
    PutObjectCommand,
  } from "@aws-sdk/client-s3";
  
  const region = "us-east-1";
  const cloudFormationClient = new CloudFormationClient({ region });
  const s3Client = new S3Client({ region });
  
  const stackName = "test-blog-Site";
  
  async function getBucketNameFromStack(): Promise<string | undefined> {
    try {
      const describeStacksParams: DescribeStacksCommandInput = { StackName: stackName };
      const response = await cloudFormationClient.send(new DescribeStacksCommand(describeStacksParams));
  
      const stack = response.Stacks?.[0];
      const outputs = stack?.Outputs;
  
      if (outputs) {
        const bucketOutput = outputs.find((output) => output.OutputKey === "BlogPostBucketName");
  
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
  
  async function uploadFileToS3(bucketName: string): Promise<void> {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: "my-first-object.txt",
          Body: "Hello JavaScript SDK!",
        })
      );
  
      console.log("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file to S3:", error);
    }
  }
  
  async function run() {
    const bucketName = await getBucketNameFromStack();
    if (bucketName) {
      await uploadFileToS3(bucketName);
    }
  }
  
  console.log('Arguments:', process.argv.slice(2));

  run();
  