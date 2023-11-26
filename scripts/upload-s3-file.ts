import { getBucketNameFromStack, uploadFileToS3 } from "./utils/s3utils";

const stackName = "test-blog-Site";
const bucketNameOutputKey = "BlogPostBucketName";

async function run() {
  const bucketName = await getBucketNameFromStack(stackName, bucketNameOutputKey);
  if (bucketName) {
    await uploadFileToS3(bucketName, "textfile.txt", "hello from upload-s3-file.ts");
  }
}

run();
