import { SSTConfig } from "sst";
import { AppSyncApi, NextjsSite, Table, Cognito } from "sst/constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { OAuthScope } from "aws-cdk-lib/aws-cognito";
import * as route53 from "aws-cdk-lib/aws-route53";

export default {
  config(_input) {
    return {
      name: "blog",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      // ### DNS and URLs
      const hostedZoneDomain = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `blog.${hostedZoneDomain}` : `${stack.stage}.blog.${hostedZoneDomain}`;
      const wwwDomain = `www.${rootDomain}`;
      const apiDomain = `api.${rootDomain}`;
      // const hostedZone = route53.HostedZone.fromLookup(stack, "Zone", { domainName: hostedZoneDomain });
      const nextAuthUrl = stack.stage === "codespace" ? "http://localhost:3000" : `https://${rootDomain}`;

      const protocol = stack.stage === "codespace" ? "http://" : "https://";
      const rootDomainWithProtocol = `${protocol}${rootDomain}`;

      // ### Admin Cognito User Pool
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
              callbackUrls: [`${nextAuthUrl}/api/auth/callback/cognito`],
            },
          },
        },
      });

      adminUserPool.cdk.userPool.addDomain("Domain", {
        cognitoDomain: {
          domainPrefix: `${stack.stage}-blog-blakemulnix-io`,
        },
      });

      // ### AppSync GraphQL API
      const notesTable = new Table(stack, "Notes", {
        fields: {
          id: "string",
        },
        primaryIndex: { partitionKey: "id" },
      });

      const gqlApi = new AppSyncApi(stack, "GraphQlAPI", {
        customDomain: {
          domainName: apiDomain,
          hostedZone: hostedZoneDomain,
        },
        schema: "packages/functions/src/graphql/schema.graphql",
        defaults: {
          function: {
            bind: [notesTable],
            url: {
              cors: {
                allowOrigins: [rootDomainWithProtocol],
                allowMethods: ["POST"],
                allowHeaders: ["*"],
              },
            }
          },
        },
        dataSources: {
          notes: "packages/functions/src/main.handler",
        },
        resolvers: {
          "Query    listNotes": "notes",
          "Query    getNoteById": "notes",
          "Mutation createNote": "notes",
          "Mutation updateNote": "notes",
          "Mutation deleteNote": "notes",
        },
        cdk: {
          graphqlApi: {
            authorizationConfig: {
              defaultAuthorization: {
                authorizationType: appsync.AuthorizationType.USER_POOL,
                userPoolConfig: {
                  userPool: adminUserPool.cdk.userPool,
                  defaultAction: appsync.UserPoolDefaultAction.ALLOW,
                },
              },
            },
          },
        },
      });

      // ### Frontend
      const blogSite = new NextjsSite(stack, "BlogSite", {
        path: "packages/frontend",
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZoneDomain,
        },
        bind: [gqlApi],
        environment: {
          NEXT_PUBLIC_GRAPHQL_API_URL: gqlApi.customDomainUrl!,
          COGNITO_CLIENT_ID: adminUserPool.cdk.userPoolClient.userPoolClientId,
          COGNITO_CLIENT_SECRET: adminUserPool.cdk.userPoolClient.userPoolClientSecret.toString(),
          COGNITO_ISSUER: `https://cognito-idp.${stack.region}.amazonaws.com/${adminUserPool.cdk.userPool.userPoolId}`,
          NEXTAUTH_URL: nextAuthUrl,
        },
      });

      stack.addOutputs({
        SiteUrl: blogSite.customDomainUrl,
        GraphqlApiUrl: gqlApi.customDomainUrl,
        NextAuthURL: nextAuthUrl
      });
    });
  },
} satisfies SSTConfig;
