import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: '../functions/src/graphql/schema.graphql',
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    './src/types/gql/': {
      preset: 'client',
    },
  },
}

export default config;

