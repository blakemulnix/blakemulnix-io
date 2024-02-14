'use client'
import React, { createContext, useContext } from 'react'
import { useSession as nextAuthUseSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@nextui-org/button'
import GraphqlData from '@/components/GraphqlData'
import GraphqlClientSideProvider from '@/providers/GraphqlClientSideProvider'
import { Session } from 'next-auth'

const SessionContext = createContext<Session>({} as Session)
export const useSession = () => useContext(SessionContext)

export default function LoginWrapperProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = nextAuthUseSession()
  
  if (status === 'loading') {
    return <div className="flex flex-col p-8 text-xl items-center">Loading login wrapper...</div>
  }

  if (status === 'authenticated') {
    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="flex flex-col items-center rounded-xl bg-stone-500 p-8 gap-8 ">
        <h1 className="text-2xl font-semibold">Blog Prototype Admin Console</h1>
        <div>
          <Button color="primary" onClick={() => signIn('cognito')}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
}
