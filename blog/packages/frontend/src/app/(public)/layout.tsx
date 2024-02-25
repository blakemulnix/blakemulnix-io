'use client'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-[1280px] px-6 gap-4 mx-auto">{children}</div>
    </>
  )
}
