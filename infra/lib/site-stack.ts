import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import type * as iam from 'aws-cdk-lib/aws-iam'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type * as route53 from 'aws-cdk-lib/aws-route53'
import { AaaaRecord, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
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
  /**
   * Whether this distribution claims the custom domain names.
   *
   * CloudFront requires an alternate domain name to be unique across every AWS
   * account, so a distribution cannot take an alias that another distribution
   * still holds. Migrating between accounts therefore needs two phases: deploy
   * with `false` to stand the site up on its CloudFront domain and verify it,
   * release the alias from the old distribution, then deploy with `true`.
   *
   * Defaults to true, which is the steady state.
   */
  attachDomains?: boolean
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

    const { domainName, hostedZone, deployRole, attachDomains = true } = props
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
    const certificate = attachDomains
      ? new acm.Certificate(this, 'SiteCertificate', {
          domainName,
          subjectAlternativeNames: [wwwDomain],
          validation: acm.CertificateValidation.fromDns(hostedZone),
        })
      : undefined

    const securityHeaders = new cloudfront.ResponseHeadersPolicy(
      this,
      'SecurityHeaders',
      {
        comment: 'Baseline security headers for the static site',
        securityHeadersBehavior: {
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.days(730),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
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
      },
    )

    /*
     * Directory indexes, which S3 behind an origin access control does not do
     * for itself.
     *
     * The site prerenders a document per route, written as `outside/canyon-
     * country/index.html`. A request for `/outside/canyon-country` asks for a
     * key that does not exist, which is a 403, which the error responses below
     * would answer with the landing page: every deep link would quietly load
     * the front door instead. Rewriting the request to the index key is what
     * makes those documents reachable.
     */
    /*
     * S3 behind an origin access control serves no directory indexes, so an
     * extensionless path has to be pointed at the document itself.
     *
     * It also carries the one redirect the site has needed so far. Photo
     * albums used to hang off the Outside Work section and were published,
     * indexed and shared at `/outside/<album>`; they are their own section
     * now. A 301 here means those links keep working and search engines
     * move their record over, rather than the site quietly shedding seven
     * addresses. `/outside` itself still exists and is left alone.
     */
    const directoryIndex = new cloudfront.Function(this, 'DirectoryIndex', {
      comment: 'Rewrites extensionless paths to index.html; moves old albums',
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request
  var uri = request.uri
  if (uri.startsWith('/outside/') && uri.length > '/outside/'.length) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/photos/' + uri.slice('/outside/'.length) } },
    }
  }
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html'
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri = uri + '/index.html'
  }
  return request
}
`),
    })

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      comment: `Static site for ${domainName}`,
      ...(certificate
        ? { domainNames: [domainName, wwwDomain], certificate }
        : {}),
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
        functionAssociations: [
          {
            function: directoryIndex,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      // Anything unresolved still falls back to the landing document rather
      // than surfacing an S3 AccessDenied page. With the rewrite above this is
      // now only genuinely unknown paths, which the app renders as home.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    })

    // DNS only once this distribution actually serves the domain.
    if (attachDomains) {
      const target = RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      )

      for (const [name, recordName] of [
        ['Apex', undefined],
        ['Www', wwwDomain],
      ] as const) {
        new ARecord(this, `${name}ARecord`, {
          zone: hostedZone,
          recordName,
          target,
        })
        new AaaaRecord(this, `${name}AaaaRecord`, {
          zone: hostedZone,
          recordName,
          target,
        })
      }
    }

    if (deployRole) {
      // Upload build output and remove files that no longer exist in dist/.
      bucket.grantReadWrite(deployRole)
      bucket.grantDelete(deployRole)

      deployRole.addToPrincipalPolicy(
        new PolicyStatement({
          sid: 'InvalidateSiteDistribution',
          actions: [
            'cloudfront:CreateInvalidation',
            'cloudfront:GetInvalidation',
          ],
          resources: [
            `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          ],
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
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description:
        'CloudFront domain, for verifying the site before DNS cutover',
    })
    new cdk.CfnOutput(this, 'SiteUrl', {
      value: attachDomains
        ? `https://${domainName}`
        : `https://${distribution.distributionDomainName}`,
    })
  }
}
