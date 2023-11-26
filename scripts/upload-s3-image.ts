import { getBucketNameFromStack, uploadImageToS3, getImageFromS3, getImageUrlFromS3 } from "./utils/s3utils";

const stackName = "test-blog-Site";
const bucketNameOutputKey = "BlogPostBucketName";

async function run() {
  const bucketName = await getBucketNameFromStack(stackName, bucketNameOutputKey);
  if (!bucketName) {
    console.log("Couldn't find bucket name");
    return;
  }

  const contentType = "image/jpeg"; // Update with the appropriate content type
  await uploadImageToS3(bucketName, "carbondale.jpg", "../portfolio/public/carbondale.jpg", contentType);

  const presignedUrl = await getImageUrlFromS3(bucketName, "carbondale.jpg");

  console.log(`presignedUrl ${presignedUrl}`);
}

run();
