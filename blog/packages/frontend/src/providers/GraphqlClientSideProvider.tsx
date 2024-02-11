"use client";
import React from "react";
import { getCsrApolloClient } from "@/graphql/csrClient";
import { ApolloProvider } from "@apollo/client/react";
import { useSession } from "@/components/admin/LoginWrapperProvider";

export default function GraphqlClientSideProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return <ApolloProvider client={getCsrApolloClient(session.accessToken!)}>{children}</ApolloProvider>;
}
