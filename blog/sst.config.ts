import { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";

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
            allowedOrigins: [`*.${rootDomain}`],
          },
        ],
      });

      const site = new NextjsSite(stack, "BlogSite", {
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
        bind: [blogPostBucket],
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
        BlogPostBucketName: blogPostBucket.bucketName
      });
      
    });
  },
} satisfies SSTConfig;