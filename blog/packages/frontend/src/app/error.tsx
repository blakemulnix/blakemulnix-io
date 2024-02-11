'use client'
import { Button } from '@nextui-org/react';
import React from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {

  return (
    <div className="flex flex-col items-center gap-4">
      <span className='text-xl'>There was an error! Darn it.</span>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
