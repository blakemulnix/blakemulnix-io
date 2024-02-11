import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import MainWrapper from '@/components/UIProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blake Mulnix | Cloud Engineering Insights',
  description: `Follow along on my blog as I explore cloud applications and infrastructure 
                as well as other software engineering topics.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainWrapper>
          {children}
        </MainWrapper>
      </body>
    </html>
  )
}
