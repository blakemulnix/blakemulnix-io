import { createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_API_ID = process.env.GRAPHQL_API_ID || 'default_value';
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY || 'default_value';
const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL || 'default_value';

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_API_URL,
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
      'x-api-id': GRAPHQL_API_ID
    },
  }),
  cache: new InMemoryCache(),
});

