import React from 'react'
import { Navbar as NextNavbar, NavbarBrand, NavbarContent, Button, NavbarItem } from '@nextui-org/react'
import { signOut } from 'next-auth/react'

export default function AdminNavbar() {
  return (
    <NextNavbar className="items-center mb-6 bg-stone-600">
      <NavbarBrand className="justify-center">
        <p className="font-medium text-3xl text-inherit">SST Blog Prototype</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" onClick={() => signOut()}>
            Sign out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  )
}
