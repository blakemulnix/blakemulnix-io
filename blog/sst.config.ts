import { SSTConfig } from 'sst'
import { AppSyncApi, NextjsSite, Table, Cognito, Function } from 'sst/constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as cdk from 'aws-cdk-lib'
import { OAuthScope } from 'aws-cdk-lib/aws-cognito'

export default {
  config(_input) {
    return {
      name: 'blog',
      region: 'us-east-1',
    }
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      // DNS and URLs (Route53, CloudFront, ACM, etc.)
      //              Production ::               Non-production :: 
      // Frontend:    blog.blakemulnix.io         {stage}.blog.blakemulnix.io
      // API:         api.blog.blakemulnix.io     api.{stage}.blog.blakemulnix.io
      const hostedZoneDomain = 'blakemulnix.io'
      const rootDomain = stack.stage === 'prod' ? 
        `blog.${hostedZoneDomain}` : `${stack.stage}.blog.${hostedZoneDomain}`
      const wwwDomain = `www.${rootDomain}`
      const apiDomain = `api.${rootDomain}`
      const nextAuthUrl = stack.stage === 'codespace' ? 'http://localhost:3000' : `https://${rootDomain}`
      const protocol = stack.stage === 'codespace' ? 'http://' : 'https://'
      const rootDomainWithProtocol = `${protocol}${rootDomain}`

      // Removal policy
      const removalPolicy = stack.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY

      // Admin User Pool (Cognito)
      const adminUserPool = new Cognito(stack, 'BlogAdminUserPool', {
        login: ['email'],
        cdk: {
          userPool: {
            removalPolicy: removalPolicy,
            selfSignUpEnabled: false,
          },
          userPoolClient: {
            idTokenValidity: cdk.Duration.days(1),
            accessTokenValidity: cdk.Duration.days(1),
            refreshTokenValidity: cdk.Duration.days(30),
            generateSecret: true,
            oAuth: {
              flows: {
                authorizationCodeGrant: true,
              },
              scopes: [OAuthScope.PROFILE],
              callbackUrls: [`${nextAuthUrl}/api/auth/callback/cognito`],
            },
          },
        },
      })

      // Cognito Domain
      adminUserPool.cdk.userPool.addDomain('BlogCognitoDomain', {
        cognitoDomain: {
          domainPrefix: `${stack.stage}-blog-blakemulnix-io`,
        },
      })

      // Posts Table (DynamoDB)
      const postsTable = new Table(stack, 'blogPosts', {
        fields: {
          id: 'string',
        },
        primaryIndex: { partitionKey: 'id' },
        cdk: {
          table: {
            removalPolicy: removalPolicy,
          },
        },
      })

      // GraphQL Authorizer (Lambda)
      const authorizer = new Function(stack, 'BlogGraphqlAuthorizerFn', {
        handler: 'packages/functions/src/authorizer.handler',
        environment: {
          COGNITO_REGION: stack.region,
          COGNITO_USER_POOL_ID: adminUserPool.cdk.userPool.userPoolId,
        },
      })

      // GraphQL API (AppSync)
      const gqlApi = new AppSyncApi(stack, 'BlogGraphqlAPI', {
        customDomain: {
          domainName: apiDomain,
          hostedZone: hostedZoneDomain,
        },
        schema: 'packages/functions/src/graphql/schema.graphql',
        defaults: {
          function: {
            bind: [postsTable],
            url: {
              cors: {
                allowOrigins: [rootDomainWithProtocol],
                allowMethods: ['POST'],
                allowHeaders: ['*'],
              },
            },
          },
        },
        dataSources: {
          Posts: 'packages/functions/src/main.handler',
        },
        resolvers: {
          'Query    listPosts': 'Posts',
          'Query    getPostById': 'Posts',
          'Mutation createPost': 'Posts',
          'Mutation updatePost': 'Posts',
          'Mutation deletePost': 'Posts',
        },
        cdk: {
          graphqlApi: {
            authorizationConfig: {
              defaultAuthorization: {
                authorizationType: appsync.AuthorizationType.LAMBDA,
                lambdaAuthorizerConfig: {
                  handler: authorizer,
                },
              },
            },
          },
        },
      })

      // Frontend (Next.js via OpenNext)
      const blogSite = new NextjsSite(stack, 'BlogNextJsSite', {
        path: 'packages/frontend',
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZoneDomain,
        },
        bind: [gqlApi],
        environment: {
          NEXT_PUBLIC_GRAPHQL_API_URL: gqlApi.customDomainUrl!,
          GRAPHQL_API_URL: gqlApi.customDomainUrl!,
          COGNITO_CLIENT_ID: adminUserPool.cdk.userPoolClient.userPoolClientId,
          COGNITO_CLIENT_SECRET: adminUserPool.cdk.userPoolClient.userPoolClientSecret.toString(),
          COGNITO_ISSUER: `https://cognito-idp.${stack.region}.amazonaws.com/${adminUserPool.cdk.userPool.userPoolId}`,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
          NEXTAUTH_URL: nextAuthUrl,
        },
      })

      stack.addOutputs({
        SiteUrl: blogSite.customDomainUrl,
        GraphqlApiUrl: gqlApi.customDomainUrl,
      })
    })
  },
} satisfies SSTConfig
