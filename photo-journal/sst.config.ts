import { SSTConfig } from 'sst'
import { StaticSite } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'portfolio',
      region: 'us-east-1',
    }
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      // Set up the DNS / URLs
      const hostedZone = 'blakemulnix.io'
      const rootDomain = stack.stage === 'prod' ? 'photos.blakemulnix.io' : `${stack.stage}.photos.blakemulnix.io`
      const wwwDomain = `www.${rootDomain}`

      // Create a new StaticSite
      const site = new StaticSite(stack, 'Site', {
        buildCommand: 'yarn build',
        path: 'build',
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
      })

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
      })
    })
  },
} satisfies SSTConfig
