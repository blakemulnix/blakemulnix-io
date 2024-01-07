import { SSTConfig } from "sst";
import { AppSyncApi, Auth, NextjsSite, Table, Function, Cognito, Bucket, Api } from "sst/constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { OAuthScope } from "aws-cdk-lib/aws-cognito";
import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';


export default {
  config(_input) {
    return {
      name: "blog",
      region: "us-east-1",
    };``
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      // ### DNS / URLs
      const hostedZoneDomain = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `blog.${hostedZoneDomain}` : `${stack.stage}.blog.${hostedZoneDomain}`;
      const wwwDomain = `www.${rootDomain}`;
      const apiDomain = `api.${rootDomain}`;
      const hostedZone = route53.HostedZone.fromLookup(stack, 'Zone', { domainName: hostedZoneDomain });
      
      // ### Cognito User Pool
      const adminUserPool = new Cognito(stack, "AdminUserPool", {
        login: ["email"],
        cdk: {
          userPool: {
            selfSignUpEnabled: false,
          },
          userPoolClient: {
            generateSecret: true,
            oAuth: {
              flows: {
                authorizationCodeGrant: true
              },
              scopes: [
                OAuthScope.PHONE,
                OAuthScope.EMAIL,
                OAuthScope.OPENID,
                OAuthScope.PROFILE,
              ],
              callbackUrls: ["http://localhost:3000/api/auth/callback/cognito"],
            },
          },
        },
      });

      adminUserPool.cdk.userPool.addDomain("Domain", {
        cognitoDomain: {
          domainPrefix: `${stack.stage}-blog-blakemulnix-io`,
        },
      });

      // // ### DynamoDB Table
      // const notesTable = new Table(stack, "Notes", {
      //   fields: {
      //     id: "string",
      //   },
      //   primaryIndex: { partitionKey: "id" },
      // });

      const api = new Api(stack, "Api", {
        routes: {
          "GET /public": "src/public.main",
          "GET /private": {
            authorizer: "myAuthorizer",
            function: "src/private.main",
          },
        },
      });

      // // ### Backend auth handler
      // const authorizer = new Function(stack, "AuthorizerFn", {
      //   handler: "packages/functions/src/authorizer.ts",
      // });

      // /// AppSync GraphQL API
      // const gqlApi = new AppSyncApi(stack, "GraphQlAPI", {
      //   customDomain: {
      //     domainName: apiDomain,
      //     hostedZone: hostedZoneDomain,
      //   },
      //   schema: "packages/functions/src/graphql/notes/schema.graphql",
      //   defaults: {
      //     function: {
      //       bind: [notesTable, adminUserPool],
      //       url: {
      //         cors: { // lock down CORS
      //           allowOrigins: ["*"],
      //           allowMethods: ["*"],
      //           allowHeaders: ["*"],
      //         },
      //       }
      //     },
      //   },
      //   dataSources: {
      //     notes: "packages/functions/src/main.handler",
      //   },
      //   resolvers: {
      //     "Query    listNotes": "notes",
      //     "Query    getNoteById": "notes",
      //     "Mutation createNote": "notes",
      //     "Mutation updateNote": "notes",
      //     "Mutation deleteNote": "notes",
      //   },
      //   cdk: {
      //     graphqlApi: {
      //       authorizationConfig: {
      //         defaultAuthorization: {
      //           authorizationType: appsync.AuthorizationType.LAMBDA,
      //           lambdaAuthorizerConfig: {
      //             handler: authorizer,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      // stack.addOutputs({
      //   ApiId: gqlApi.apiId,
      //   ApiUrl: gqlApi.url,
      //   ApiKey: gqlApi.cdk.graphqlApi.apiKey || "",
      // });

      // ### Bucket!
      // const imagesBucket = new Bucket(stack, "ImagesBucket", {
      //   name: "images2.blakemulnix.io",
      //   // cors: [
      //   //   {
      //   //     allowedOrigins: ["*"],
      //   //     allowedMethods: ["GET"],
      //   //     allowedHeaders: ["*"],
      //   //   },
      //   // ],
      //   cdk: {
      //     bucket: {
      //       isWebsite: true,
      //       // publicReadAccess: true,
      //       // blockPublicAccess: {
      //       //   blockPublicAcls: false,
      //       //   blockPublicPolicy: false,
      //       //   ignorePublicAcls: false,
      //       //   restrictPublicBuckets: false,
      //       // },
      //       accessControl: s3.BucketAccessControl.PUBLIC_READ,
      //       // policy: s3.BucketPolicy.fromBucket(gqlApi.cdk.graphqlApi.api),
      //       websiteIndexDocument: 'index.html',
      //     }
      //   }
      //   ,
      // });

      const bucket = new s3.Bucket(this, 'MyImageBucket', {
        bucketName: 'blakemulnix-image-bucket', // Replace with your unique bucket name
        publicReadAccess: true, // Allow public read access
        websiteIndexDocument: 'index.html', // Optional: Set if you want to host a static website
        websiteErrorDocument: 'error.html', // Optional: Set a custom error document
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      });

      // const bucketPolicy = new iam.PolicyStatement({
      //   actions: ['s3:GetObject'],
      //   resources: [imagesBucket.cdk.bucket.arnForObjects('*')],
      //   principals: [new iam.AnyPrincipal()],
      // });
      
      // imagesBucket.cdk.bucket.addToResourcePolicy(bucketPolicy);

      // Create a DNS record to point images.blakemulnix.io at this bucket
      // const imagesBucketDnsRecord = new route53.ARecord(stack, 'AliasRecord', {
      //   zone: hostedZone,
      //   target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucket)), // Replace with your target
      //   recordName: 'images' // Optional, use if you want 'www.example.com'
      // });

      // console.log(JSON.stringify(imagesBucket));

      // // ### Frontend
      // const blogSite = new NextjsSite(stack, "BlogSite", {
      //   path: "packages/frontend",
      //   customDomain: {
      //     domainName: rootDomain,
      //     domainAlias: wwwDomain,
      //     hostedZone: hostedZoneDomain,
      //   },
      //   bind: [gqlApi],
      //   environment: {
      //     GRAPHQL_API_ID: gqlApi.apiId,
      //     GRAPHQL_API_URL: gqlApi.url,
      //     GRAPHQL_API_KEY: gqlApi.cdk.graphqlApi.apiKey!,
      //     COGNITO_CLIENT_ID: adminUserPool.cdk.userPoolClient.userPoolClientId,
      //     COGNITO_CLIENT_SECRET: adminUserPool.cdk.userPoolClient.userPoolClientSecret.toString(),
      //     COGNITO_ISSUER: `https://cognito-idp.${stack.region}.amazonaws.com/${adminUserPool.cdk.userPool.userPoolId}`,
      //     NEXTAUTH_URL: `https://${rootDomain}`,
      //   },
      // });

      // // blogSite.cdk?.hostedZone?.hostedZoneId

      // stack.addOutputs({
      //   // SiteUrl: blogSite.customDomainUrl,
      //   ImagesBucketUrl: imagesBucketDnsRecord.domainName,
      //   imagesBucketS3Url: bucket.bucketWebsiteUrl,
      // });
    });
  },
} satisfies SSTConfig;
