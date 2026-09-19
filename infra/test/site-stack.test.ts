import * as cdk from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

import { DnsStack } from '../lib/dns-stack'
import { GithubOidcStack } from '../lib/github-oidc-stack'
import { SiteStack } from '../lib/site-stack'

const env = { account: '123456789012', region: 'us-east-1' }

/** Builds DnsStack and SiteStack the way bin/app.ts wires them together. */
const buildSite = () => {
  const app = new cdk.App()
  const dns = new DnsStack(app, 'TestDns', { env, domainName: 'example.com' })
  const site = new SiteStack(app, 'TestSite', {
    env,
    domainName: 'example.com',
    hostedZone: dns.hostedZone,
  })
  return { dns, site }
}

describe('DnsStack', () => {
  it('creates the hosted zone and retains it', () => {
    const template = Template.fromStack(buildSite().dns)
    template.hasResourceProperties('AWS::Route53::HostedZone', {
      Name: 'example.com.',
    })
    template.hasResource('AWS::Route53::HostedZone', {
      DeletionPolicy: 'Retain',
    })
  })

  it('delegates subdomains to other accounts when configured', () => {
    const app = new cdk.App()
    const dns = new DnsStack(app, 'D', {
      env,
      domainName: 'example.com',
      delegations: [
        {
          subdomain: 'mycoolthing',
          nameServers: ['ns-1.awsdns-00.org', 'ns-2.awsdns-00.net'],
        },
      ],
    })
    Template.fromStack(dns).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'mycoolthing.example.com.',
      Type: 'NS',
      ResourceRecords: ['ns-1.awsdns-00.org', 'ns-2.awsdns-00.net'],
    })
  })
})

describe('SiteStack', () => {
  const template = Template.fromStack(buildSite().site)

  it('keeps the origin bucket fully private', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    })
  })

  it('serves both the apex and www domains over redirected HTTPS', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: Match.arrayWith(['example.com', 'www.example.com']),
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: 'redirect-to-https',
        }),
        HttpVersion: 'http2and3',
      },
    })
  })

  it('reads from S3 through origin access control rather than a public origin', () => {
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1)
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Principal: { Service: 'cloudfront.amazonaws.com' },
            Action: 's3:GetObject',
          }),
        ]),
      }),
    })
  })

  it('validates its certificate against both names via DNS', () => {
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'example.com',
      SubjectAlternativeNames: ['www.example.com'],
      ValidationMethod: 'DNS',
    })
  })

  it('publishes IPv4 and IPv6 aliases for both names', () => {
    template.resourceCountIs('AWS::Route53::RecordSet', 4)
  })

  /*
   * The viewer-request function is run, not read. It is the one piece of
   * this stack that is source code rather than configuration, and asserting
   * that a string appears in the template would pass just as happily for a
   * rewrite that sends every request to the wrong document.
   */
  describe('its viewer-request function', () => {
    const functions = template.findResources('AWS::CloudFront::Function')
    const source = Object.values(functions)[0].Properties.FunctionCode as string
    const handler = new Function(`${source}; return handler`)() as (event: {
      request: { uri: string }
    }) => {
      uri?: string
      statusCode?: number
      headers?: Record<string, { value: string }>
    }

    const get = (uri: string) => handler({ request: { uri } })

    it('points extensionless paths at their document', () => {
      expect(get('/photos').uri).toBe('/photos/index.html')
      expect(get('/photos/canyon-country').uri).toBe(
        '/photos/canyon-country/index.html',
      )
      expect(get('/').uri).toBe('/index.html')
    })

    it('leaves a request for a real file alone', () => {
      expect(get('/photos/2026-09-04-01-900.webp').uri).toBe(
        '/photos/2026-09-04-01-900.webp',
      )
      expect(get('/sitemap.xml').uri).toBe('/sitemap.xml')
    })

    it('redirects album links published under the old section', () => {
      const moved = get('/outside/canyon-country')
      expect(moved.statusCode).toBe(301)
      expect(moved.headers?.location.value).toBe('/photos/canyon-country')
    })

    it('leaves the Outside Work section itself where it is', () => {
      expect(get('/outside').uri).toBe('/outside/index.html')
      expect(get('/outside/').uri).toBe('/outside/index.html')
    })
  })
})

describe('SiteStack without domains attached', () => {
  // First phase of a cross-account migration: CloudFront rejects an alias that
  // another distribution still holds, so the new one is stood up bare.
  const app = new cdk.App()
  const dns = new DnsStack(app, 'D2', { env, domainName: 'example.com' })
  const template = Template.fromStack(
    new SiteStack(app, 'BareSite', {
      env,
      domainName: 'example.com',
      hostedZone: dns.hostedZone,
      attachDomains: false,
    }),
  )

  it('claims no aliases and requests no certificate', () => {
    template.resourceCountIs('AWS::CertificateManager::Certificate', 0)
    const distributions = template.findResources(
      'AWS::CloudFront::Distribution',
    )
    for (const d of Object.values(distributions)) {
      expect(d.Properties.DistributionConfig.Aliases).toBeUndefined()
    }
  })

  it('publishes no DNS records until it serves the domain', () => {
    template.resourceCountIs('AWS::Route53::RecordSet', 0)
  })

  it('still creates the bucket and distribution', () => {
    template.resourceCountIs('AWS::S3::Bucket', 1)
    template.resourceCountIs('AWS::CloudFront::Distribution', 1)
  })
})

describe('GithubOidcStack', () => {
  const template = Template.fromStack(
    new GithubOidcStack(new cdk.App(), 'TestOidc', {
      env,
      githubRepo: 'owner/repo',
      deployBranch: 'main',
      deployEnvironment: 'production',
    }),
  )

  // GitHub swaps the `sub` claim depending on whether the job declares an
  // environment, and trusting only the ref form silently breaks every deploy
  // with "Not authorized to perform sts:AssumeRoleWithWebIdentity".
  it('trusts both the environment and ref subject forms, and nothing else', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringEquals: {
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                'token.actions.githubusercontent.com:sub': [
                  'repo:owner/repo:environment:production',
                  'repo:owner/repo:ref:refs/heads/main',
                ],
              },
            },
          }),
        ]),
      }),
    })
  })

  it('scopes the trust to this repository only', () => {
    const roles = template.findResources('AWS::IAM::Role')
    const subjects = Object.values(roles).flatMap((role) =>
      (
        role.Properties.AssumeRolePolicyDocument.Statement as {
          Condition?: Record<string, Record<string, unknown>>
        }[]
      ).flatMap(
        (statement) =>
          statement.Condition?.StringEquals?.[
            'token.actions.githubusercontent.com:sub'
          ] ?? [],
      ),
    )
    expect(subjects.length).toBeGreaterThan(0)
    for (const subject of subjects as string[]) {
      expect(subject.startsWith('repo:owner/repo:')).toBe(true)
    }
  })

  it('grants only CDK bootstrap role assumption on its own', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: [Match.objectLike({ Action: 'sts:AssumeRole' })],
      }),
    })
  })
})
