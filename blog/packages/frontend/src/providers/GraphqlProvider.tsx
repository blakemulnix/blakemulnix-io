"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { getApolloClient } from "@/graphql/client";
import { ApolloProvider } from "@apollo/client/react";

export default function GraphqlProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  

  return <ApolloProvider client={getApolloClient(session!.accessToken!)}>{children}</ApolloProvider>;
}
