import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "frontend",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new StaticSite(stack, "Site", {
        path: "out",
        customDomain: {
          domainName:
            stack.stage === "prod" ? "blakemulnix.io" : `${stack.stage}.blakemulnix.io`,
          domainAlias:
          stack.stage === "prod" ? "www.blakemulnix.io" : `www.${stack.stage}.blakemulnix.io`,
          hostedZone: "blakemulnix.io",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;