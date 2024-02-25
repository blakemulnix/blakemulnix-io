import { createHttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache()

export const getCsrApolloClient = (accessToken: string) => {
  const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;

  return new ApolloClient({
    link: createHttpLink({
      uri: GRAPHQL_API_URL,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }),
    cache: cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-only',
        pollInterval: 0
      }
    }
  });
};
