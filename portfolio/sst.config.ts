import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "portfolio",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZoneDomain = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `${hostedZoneDomain}` : `${stack.stage}.${hostedZoneDomain}`;
      const wwwDomain = `www.${rootDomain}`;

      const site = new StaticSite(stack, "Site", {
        path: "build",
        buildCommand: "yarn build",
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: "blakemulnix.io",
        },
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
        CloudfrontUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
