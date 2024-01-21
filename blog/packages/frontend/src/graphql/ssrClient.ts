import { HttpLink } from "@apollo/client";
import { NextSSRInMemoryCache, NextSSRApolloClient } from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient: getSsrApolloClient } = registerApolloClient(() => {
  const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL!;

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_API_URL,
      headers: {
        Authorization: "Bearer " + "bogus",
      },
    }),
  });
});
