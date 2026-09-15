#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'

import type { SubdomainDelegation } from '../lib/dns-stack'

import { DnsStack } from '../lib/dns-stack'
import { GithubOidcStack } from '../lib/github-oidc-stack'
import { SiteStack } from '../lib/site-stack'

const app = new cdk.App()

/*
 * Configuration comes from cdk.json context so nothing is tied to a single AWS
 * account. Override on the command line with, for example:
 *   npx cdk deploy --all -c domainName=staging.blakemulnix.io
 */
const domainName = app.node.tryGetContext('domainName') as string
const githubRepo = app.node.tryGetContext('githubRepo') as string
const deployBranch = (app.node.tryGetContext('deployBranch') as string | undefined) ?? 'main'
const deployEnvironment = (app.node.tryGetContext('deployEnvironment') as string | undefined) ?? 'production'
/**
 * Context set on the command line arrives as a string, so `-c flag=false`
 * yields "false" rather than the boolean. Comparing against `false` alone
 * silently ignores the flag.
 */
const contextFlag = (key: string, fallback: boolean): boolean => {
  const raw = app.node.tryGetContext(key)
  if (raw === undefined || raw === null) return fallback
  if (typeof raw === 'boolean') return raw
  return String(raw).toLowerCase() !== 'false'
}

const createOidcProvider = contextFlag('createOidcProvider', true)
// Set false for the first deploy of a migration, while the previous
// distribution still holds the domain aliases. See SiteStackProps.
const attachDomains = contextFlag('attachDomains', true)
// Subdomains served from other project accounts, e.g.
//   [{ "subdomain": "mycoolthing", "nameServers": ["ns-1.awsdns-00.co.uk", ...] }]
const delegations = (app.node.tryGetContext('delegations') as SubdomainDelegation[] | undefined) ?? []

if (!domainName || !githubRepo) {
  throw new Error('Missing required context: set domainName and githubRepo in cdk.json')
}

// CloudFront certificates must live in us-east-1, so everything is deployed
// there to keep the certificate and distribution in one stack.
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
}

const tags = { Project: 'blakemulnix-io', ManagedBy: 'cdk' }

const oidc = new GithubOidcStack(app, 'SiteGithubOidc', {
  env,
  tags,
  githubRepo,
  deployBranch,
  deployEnvironment,
  createOidcProvider,
})

// Phase one: the zone must be authoritative at the registrar before the
// certificate in SiteStack can pass DNS validation.
const dns = new DnsStack(app, 'SiteDns', { env, tags, domainName, delegations })

new SiteStack(app, 'Site', {
  env,
  tags,
  domainName,
  hostedZone: dns.hostedZone,
  deployRole: oidc.deployRole,
  attachDomains,
})
