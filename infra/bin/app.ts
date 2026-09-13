#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'

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
const createOidcProvider = app.node.tryGetContext('createOidcProvider') !== false

if (!domainName || !githubRepo) {
  throw new Error('Missing required context: set domainName and githubRepo in cdk.json')
}

// CloudFront certificates must live in us-east-1, and HostedZone.fromLookup
// needs a concrete account and region rather than an environment-agnostic stack.
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
}

const tags = { Project: 'blakemulnix-io', ManagedBy: 'cdk' }

const oidc = new GithubOidcStack(app, 'SiteGithubOidc', { env, tags, githubRepo, deployBranch, createOidcProvider })

new SiteStack(app, 'Site', { env, tags, domainName, deployRole: oidc.deployRole })
