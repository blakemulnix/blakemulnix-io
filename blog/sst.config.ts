import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "blog",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new StaticSite(stack, "Site", {
        path: "out",
        customDomain: {
          domainName:
            stack.stage === "prod" ? "blog.blakemulnix.io" : `${stack.stage}.blog.blakemulnix.io`,
          domainAlias:
          stack.stage === "prod" ? "www.blog.blakemulnix.io" : `www.${stack.stage}.blog.blakemulnix.io`,
          hostedZone: "blakemulnix.io",
        },
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;