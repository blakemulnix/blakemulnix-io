"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { getCsrApolloClient } from "@/graphql/csrClient";
import { ApolloProvider } from "@apollo/client/react";

export default function GraphqlClientSideProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return <ApolloProvider client={getCsrApolloClient(session!.accessToken!)}>{children}</ApolloProvider>;
}
