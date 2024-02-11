'use client'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'

export default function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <div className="dark text-foreground bg-background min-h-screen min-w-screen">{children}</div>
    </NextUIProvider>
  )
}
