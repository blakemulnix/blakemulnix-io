'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import LoginWrapperProvider from '@/components/admin/LoginWrapperProvider'
import UIProvider from '@/components/UIProvider'
import GraphqlClientSideProvider from '@/providers/GraphqlClientSideProvider'
import AdminNavbar from '@/components/admin/AdminNavbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <SessionProvider>
        <LoginWrapperProvider>
          <GraphqlClientSideProvider>
            <AdminNavbar />
              <div className="max-w-[1280px] px-6 gap-4 mx-auto">{children}</div>
          </GraphqlClientSideProvider>
        </LoginWrapperProvider>
      </SessionProvider>
    </UIProvider>
  )
}
