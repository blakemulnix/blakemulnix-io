"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import {Button} from '@nextui-org/button'; 

export default function Page() {

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Button onClick={() => signIn('cognito')}>Sign in</Button>      
    </div>
  )
}