import { SSTConfig } from "sst";
import { Bucket, Config, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "blog",
      region: "us-east-1",
    };
  },
  
  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZone = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `blog.${hostedZone}` : `${stack.stage}.blog.${hostedZone}`;
      const wwwDomain = `www.${rootDomain}`;

      const blogPostBucket = new Bucket(stack, "blogPosts", {
        cors: [
          {
            allowedMethods: ["GET"],
            allowedOrigins: [`*`],
          },
        ],
      });

      const AWS_ACCESS_KEY_ID = new Config.Secret(stack, "AWS_ACCESS_KEY_ID");
      const AWS_SECRET_ACCESS_KEY = new Config.Secret(stack, "AWS_SECRET_ACCESS_KEY");
      const AWS_REGION = new Config.Secret(stack, "AWS_REGION");

      const site = new NextjsSite(stack, "BlogSite", {
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
        bind: [blogPostBucket, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION],
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
        BlogPostBucketName: blogPostBucket.bucketName
      });
      
    });
  },
} satisfies SSTConfig;