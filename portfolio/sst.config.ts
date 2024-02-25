import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

export default {
  // Configure app name and AWS region
  config(_input) {
    return {
      name: "portfolio",
      region: "us-east-1",
    };
  },

  // App <- Stack(s) <- Construct(s) 
  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZone = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? "blakemulnix.io" : `${stack.stage}.blakemulnix.io`;
      const wwwDomain = `www.${rootDomain}`;

      const site = new StaticSite(stack, "Site", {
        path: "build",
        buildCommand: "yarn build",
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl
      });
    });
  },
} satisfies SSTConfig;
