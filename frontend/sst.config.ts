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
      // const site = new NextjsSite(stack, "site");

      const site = new StaticSite(stack, "Site", {
        path: "out",
        customDomain: {
          domainName: "test.blakemulnix.io",
          domainAlias: "www.test.blakemulnix.io",
          hostedZone: "blakemulnix.io",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
