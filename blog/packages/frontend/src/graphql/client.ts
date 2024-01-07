import { createHttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

export const getApolloClient = (accessToken: string) => {
  const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;

  const example = process.env.NEXT_PUBLIC_EXAMPLE;

  console.log("example", example);

  console.log("GRAPHQL_API_URL", GRAPHQL_API_URL);

  return new ApolloClient({
    link: createHttpLink({
      uri: GRAPHQL_API_URL,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }),
    cache: new InMemoryCache(),
  });
};
