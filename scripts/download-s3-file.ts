import { getBucketNameFromStack, getFileFromS3 } from "./s3utils";

const stackName = "test-blog-Site";
const bucketNameOutputKey = "BlogPostBucketName";

async function run() {
  const bucketName = await getBucketNameFromStack(stackName, bucketNameOutputKey);
  if (bucketName) {
    const content = await getFileFromS3(bucketName, "textfile.txt");
    console.log(content);
  }
}

run();
