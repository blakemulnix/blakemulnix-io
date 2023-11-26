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
    // console.log(`process.env.MY_VAR: ${process.env.MY_VAR}`)

    app.stack(function Site({ stack }) {
      const hostedZone = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `blog.${hostedZone}` : `${stack.stage}.blog.${hostedZone}`;
      const wwwDomain = `www.${rootDomain}`;

      // const STRIPE_KEY = new Config.Secret(stack, "STRIPE_KEY");

      const blogPostBucket = new Bucket(stack, "blogPosts", {
        cors: [
          {
            allowedMethods: ["GET"],
            allowedOrigins: [`*`],
          },
        ],
      });

      const site = new NextjsSite(stack, "BlogSite", {
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
        bind: [blogPostBucket], // todo add secret
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
        BlogPostBucketName: blogPostBucket.bucketName
      });
      
    });
  },
} satisfies SSTConfig;