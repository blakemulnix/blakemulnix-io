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
    template.hasResourceProperties('AWS::Route53::HostedZone', { Name: 'example.com.' })
    template.hasResource('AWS::Route53::HostedZone', { DeletionPolicy: 'Retain' })
  })

  it('delegates subdomains to other accounts when configured', () => {
    const app = new cdk.App()
    const dns = new DnsStack(app, 'D', {
      env,
      domainName: 'example.com',
      delegations: [{ subdomain: 'mycoolthing', nameServers: ['ns-1.awsdns-00.org', 'ns-2.awsdns-00.net'] }],
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
        DefaultCacheBehavior: Match.objectLike({ ViewerProtocolPolicy: 'redirect-to-https' }),
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
})

describe('GithubOidcStack', () => {
  const template = Template.fromStack(
    new GithubOidcStack(new cdk.App(), 'TestOidc', {
      env,
      githubRepo: 'owner/repo',
      deployBranch: 'main',
    }),
  )

  it('restricts the trust policy to one repository and branch', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringEquals: {
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                'token.actions.githubusercontent.com:sub': 'repo:owner/repo:ref:refs/heads/main',
              },
            },
          }),
        ]),
      }),
    })
  })

  it('grants only CDK bootstrap role assumption on its own', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: [Match.objectLike({ Action: 'sts:AssumeRole' })],
      }),
    })
  })
})
