import React from 'react'
import { Navbar as NextNavbar, NavbarBrand, NavbarContent } from '@nextui-org/react'

export default function Navbar() {
  return (
    <NextNavbar className="items-center mb-6 bg-default-100" height='5rem' maxWidth='xl'>
      <NavbarBrand className="flex flex-col gap-1 items-start">
        <span className="font-medium text-2xl text-inherit">Blog Prototype</span>
        <span className="font-medium text-lg tracking-widest text-inherit">Public Page</span>
      </NavbarBrand>
    </NextNavbar>
  )
}
