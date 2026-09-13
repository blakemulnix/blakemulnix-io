import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { Construct } from 'constructs'

/** A subdomain served by a hosted zone in a different AWS account. */
export interface SubdomainDelegation {
  /** Label only, e.g. "mycoolthing" for mycoolthing.blakemulnix.io. */
  subdomain: string
  /** Name servers of the delegated zone in the other account. */
  nameServers: string[]
}

export interface DnsStackProps extends cdk.StackProps {
  domainName: string
  /** Subdomains handed off to other project accounts. */
  delegations?: SubdomainDelegation[]
}

/**
 * Owns the public hosted zone for the domain, separate from the site itself.
 *
 * Kept in its own stack for two reasons. The zone must exist and be
 * authoritative before SiteStack's certificate can pass DNS validation, which
 * makes this a distinct deployment phase. And the zone outlives any particular
 * site implementation, so it should not be destroyed by changes to one.
 *
 * Note: domain *registration* has no CloudFormation resource. Pointing the
 * registrar at the name servers below is necessarily a manual step.
 */
export class DnsStack extends cdk.Stack {
  public readonly hostedZone: route53.PublicHostedZone

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props)

    const { domainName, delegations = [] } = props

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
      comment: `${domainName} — managed by CDK`,
    })
    // The zone is the domain's root of trust; never replace it implicitly.
    this.hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)

    // Hand subdomains to project accounts that run their own zones.
    for (const { subdomain, nameServers } of delegations) {
      new route53.NsRecord(this, `Delegate${subdomain.replace(/[^A-Za-z0-9]/g, '')}`, {
        zone: this.hostedZone,
        recordName: subdomain,
        values: nameServers,
        ttl: cdk.Duration.hours(1),
      })
    }

    new cdk.CfnOutput(this, 'HostedZoneId', { value: this.hostedZone.hostedZoneId })
    new cdk.CfnOutput(this, 'NameServers', {
      // Set these at the registrar to make this zone authoritative.
      value: cdk.Fn.join(', ', this.hostedZone.hostedZoneNameServers ?? []),
      description: 'Set these as the domain name servers at the registrar',
    })
  }
}
