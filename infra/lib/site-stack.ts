import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import type * as iam from 'aws-cdk-lib/aws-iam'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type * as route53 from 'aws-cdk-lib/aws-route53'
import { ARecord, AaaaRecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import type { Construct } from 'constructs'

export interface SiteStackProps extends cdk.StackProps {
  /** Apex domain, e.g. blakemulnix.io. `www.` is added as an alias. */
  domainName: string
  /**
   * Zone created by DnsStack. Passed in rather than looked up so the zone is
   * owned by CDK and needs no pre-existing account state.
   */
  hostedZone: route53.IHostedZone
  /**
   * CI role granted exactly the access needed to publish content: write to
   * this bucket and invalidate this distribution. Nothing wider.
   */
  deployRole?: iam.IRole
}

/**
 * Static site hosting: a private S3 bucket read through CloudFront via Origin
 * Access Control, fronted by an ACM certificate and Route 53 alias records.
 *
 * This stack owns infrastructure only. Site content is uploaded by CI with
 * `s3 sync`, so publishing a copy change does not require a CloudFormation
 * deployment. The bucket name and distribution id are exported for that job.
 */
export class SiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props)

    const { domainName, hostedZone, deployRole } = props
    const wwwDomain = `www.${domainName}`

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      // The bucket holds only build output, which is reproducible from source.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // CloudFront requires its certificate in us-east-1, which is where this
    // stack is deployed.
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName,
      subjectAlternativeNames: [wwwDomain],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    })

    const securityHeaders = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      comment: 'Baseline security headers for the static site',
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(730),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        contentSecurityPolicy: {
          // Self-hosted fonts and bundled assets only; no third-party origins.
          contentSecurityPolicy: [
            "default-src 'self'",
            "img-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "script-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
          ].join('; '),
          override: true,
        },
      },
    })

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      comment: `Static site for ${domainName}`,
      domainNames: [domainName, wwwDomain],
      certificate,
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableLogging: false,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: securityHeaders,
        compress: true,
      },
      // Single-page site: anything unresolved falls back to the one document
      // rather than surfacing an S3 AccessDenied page.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
      ],
    })

    const target = RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))

    for (const [name, recordName] of [
      ['Apex', undefined],
      ['Www', wwwDomain],
    ] as const) {
      new ARecord(this, `${name}ARecord`, { zone: hostedZone, recordName, target })
      new AaaaRecord(this, `${name}AaaaRecord`, { zone: hostedZone, recordName, target })
    }

    if (deployRole) {
      // Upload build output and remove files that no longer exist in dist/.
      bucket.grantReadWrite(deployRole)
      bucket.grantDelete(deployRole)

      deployRole.addToPrincipalPolicy(
        new PolicyStatement({
          sid: 'InvalidateSiteDistribution',
          actions: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation'],
          resources: [`arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`],
        }),
      )

      // Lets CI discover the bucket and distribution from stack outputs
      // instead of duplicating them as GitHub variables.
      deployRole.addToPrincipalPolicy(
        new PolicyStatement({
          sid: 'ReadSiteStackOutputs',
          actions: ['cloudformation:DescribeStacks'],
          resources: [this.stackId],
        }),
      )
    }

    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket that CI syncs build output into',
      exportName: `${this.stackName}-SiteBucketName`,
    })
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution to invalidate after a content sync',
      exportName: `${this.stackName}-DistributionId`,
    })
    new cdk.CfnOutput(this, 'SiteUrl', { value: `https://${domainName}` })
  }
}
