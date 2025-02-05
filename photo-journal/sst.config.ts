import { SSTConfig } from 'sst'
import { Bucket, NextjsSite, Function, Config } from 'sst/constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'

export default {
  config(_input) {
    return {
      name: 'photo-journal',
      region: 'us-east-1',
    }
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      // Set up the DNS / URLs
      const hostedZone = 'blakemulnix.io'
      const rootDomain = stack.stage === 'prod' ? 'photos.blakemulnix.io' : `${stack.stage}.photos.blakemulnix.io`
      const wwwDomain = `www.${rootDomain}`

      // Create a bucket for storing photos
      const bucket = new Bucket(stack, 'PhotoBucket')

      // TODO lock down via cors
      // Create CloudFront distribution for the bucket
      const photosCdnDomain = `cdn.${rootDomain}`
      const photoCdn = new cloudfront.Distribution(stack, 'PhotoDistribution', {
        defaultBehavior: {
          origin: new origins.S3Origin(bucket.cdk.bucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        domainNames: [photosCdnDomain],
        certificate: new acm.Certificate(stack, 'PhotosCert', {
          domainName: photosCdnDomain,
          validation: acm.CertificateValidation.fromDns(),
        }),
      })

      // Add Route 53 record for CloudFront distribution
      new route53.CnameRecord(stack, 'CdnDomainRecord', {
        zone: route53.HostedZone.fromLookup(stack, 'Zone', {
          domainName: hostedZone,
        }),
        recordName: photosCdnDomain,
        domainName: photoCdn.distributionDomainName,
      })

      // Create a resize function to resize images
      const layer = new lambda.LayerVersion(stack, 'MyLayer', {
        code: lambda.Code.fromAsset('layers/sharp'),
        compatibleArchitectures: [lambda.Architecture.ARM_64],
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      })
      const resizeFunction = new Function(stack, 'ResizeFunction', {
        handler: 'functions/resize.handler',
        runtime: 'nodejs18.x',
        architecture: 'arm_64',
        nodejs: {
          esbuild: {
            external: ['sharp'],
          },
        },
        layers: [layer.layerVersionArn],
        deadLetterQueueEnabled: true,
        retryAttempts: 2,
        permissions: [bucket],
      })

      // Trigger the resize function on uploads to the bucket
      bucket.addNotifications(stack, {
        resize: {
          function: resizeFunction,
          events: ['object_created_put', 'object_created_post', 'object_created_complete_multipart_upload'],
          filters: [
            { suffix: '.original.jpg' }
          ],
        },
      })

      // Create aNext.js Site (with server)
      const site = new NextjsSite(stack, 'Site', {
        path: '.',
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
        runtime: 'nodejs18.x',
        environment: {
          BUCKET_NAME: bucket.bucketName,
          CLOUDFRONT_URL: photosCdnDomain,
          REGION: stack.region,
        },
        permissions: [bucket],
      })

      new Config.Parameter(stack, "PhotosDistributionId", {
        value: photoCdn.distributionId,
      });

      // Only create the parameter if the distribution ID exists
      if (site.cdk?.distribution?.distributionId) {
        new Config.Parameter(stack, "SiteDistributionId", {
          value: site.cdk.distribution.distributionId,
        });
      }

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
        PhotosBucket: bucket.bucketName,
        ResizeFunction: resizeFunction.functionName,
      })
    })
  },
} satisfies SSTConfig
