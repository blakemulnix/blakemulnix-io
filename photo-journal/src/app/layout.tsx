import type { Metadata } from 'next'
import { PT_Serif } from 'next/font/google'
import './globals.css'
import React from 'react'

const ptSerif = PT_Serif({ subsets: ['latin'], weight: ['400', '700'] })
export const metadata: Metadata = {
  title: 'Blake Mulnix - Photo Journal',
  description: `Follow along on my road trips, gravel biking adventures, 
  and treks through our national forests and desert trails.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={ptSerif.className}>{children}</body>
    </html>
  )
}
