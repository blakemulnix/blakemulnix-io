import { SSTConfig } from "sst";
import { AppSyncApi, NextjsSite, Table } from "sst/constructs";
import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";


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

      // ### DynamoDB Table
      const notesTable = new Table(stack, "Notes", {
        fields: {
          id: "string",
        },
        primaryIndex: { partitionKey: "id" },
      });

      /// AppSync GraphQL API
      const api = new AppSyncApi(stack, "AppSyncApi", {
        customDomain: {
          domainName: apiDomain,
          hostedZone: hostedZone,
        },
        schema: "packages/functions/src/graphql/schema.graphql",
        defaults: {
          function: {
            bind: [notesTable],
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
                authorizationType: appsync.AuthorizationType.API_KEY,
                apiKeyConfig: {
                  expires: cdk.Expiration.after(cdk.Duration.days(365)),
                },
              }
            }
          }
        }
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
          GRAPHQL_API_KEY: api.cdk.graphqlApi.apiKey || "",
        }
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
