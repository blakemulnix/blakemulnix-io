"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import {Button} from '@nextui-org/button'; 
import { getApolloClient } from "@/graphql/client";
import GraphqlData from "@/components/GraphqlData";
import GraphqlProvider from "@/providers/GraphqlProvider";

export default function Page() {
  
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Hello {session.user?.email}</h1>
        </div>
        <Button onClick={() => signOut()}>Sign out</Button>
        <div>
          <p>Graphql data</p>
        </div>
        <GraphqlProvider>
          <GraphqlData />
        </GraphqlProvider>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Button onClick={() => signIn('cognito')}>Sign in</Button>      
    </div>
  )
}