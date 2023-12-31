import { SSTConfig } from "sst";
import { AppSyncApi, Auth, NextjsSite, Table, Function, Cognito } from "sst/constructs";
import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { OAuthScope, UserPoolClient } from "aws-cdk-lib/aws-cognito";

export default {
  config(_input) {
    return {
      name: "blog",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZone = "blakemulnix.io";
      const rootDomain = stack.stage === "prod" ? `blog.${hostedZone}` : `${stack.stage}.blog.${hostedZone}`;
      const wwwDomain = `www.${rootDomain}`;
      const apiDomain = `api.${rootDomain}`;

      // ### Cognito User Pool
      const userPool = new Cognito(stack, "Auth", {
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

      userPool.cdk.userPool.addDomain("Domain", {
        cognitoDomain: {
          domainPrefix: `${stack.stage}-blog-blakemulnix-io`,
        },
      });

      // ### DynamoDB Table
      const notesTable = new Table(stack, "Notes", {
        fields: {
          id: "string",
        },
        primaryIndex: { partitionKey: "id" },
      });

      // ### Backend auth handler
      const authorizer = new Function(stack, "AuthorizerFn", {
        handler: "packages/functions/src/authorizer.handler",
      });

      /// AppSync GraphQL API
      const api = new AppSyncApi(stack, "AppSyncApi", {
        customDomain: {
          domainName: apiDomain,
          hostedZone: hostedZone,
        },
        schema: "packages/functions/src/graphql/notes/schema.graphql",
        defaults: {
          function: {
            bind: [notesTable, userPool],
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
                authorizationType: appsync.AuthorizationType.LAMBDA,
                lambdaAuthorizerConfig: {
                  handler: authorizer,
                },
              },
            },
          },
        },
      });

      stack.addOutputs({
        ApiId: api.apiId,
        ApiUrl: api.url,
        ApiKey: api.cdk.graphqlApi.apiKey || "",
      });

      // ### Frontend
      const site = new NextjsSite(stack, "BlogSite", {
        path: "packages/frontend",
        customDomain: {
          domainName: rootDomain,
          domainAlias: wwwDomain,
          hostedZone: hostedZone,
        },
        bind: [api],
        environment: {
          GRAPHQL_API_ID: api.apiId,
          GRAPHQL_API_URL: api.url,
          GRAPHQL_API_KEY: api.cdk.graphqlApi.apiKey!,
          COGNITO_CLIENT_ID: userPool.cdk.userPoolClient.userPoolClientId,
          COGNITO_CLIENT_SECRET: userPool.cdk.userPoolClient.userPoolClientSecret.toString(),
          COGNITO_ISSUER: `https://cognito-idp.${stack.region}.amazonaws.com/${userPool.cdk.userPool.userPoolId}`,
          NEXTAUTH_URL: `https://${rootDomain}`,
        },
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
