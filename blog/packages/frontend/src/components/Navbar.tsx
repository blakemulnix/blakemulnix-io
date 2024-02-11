import React from 'react'
import { Navbar as NextNavbar, NavbarBrand } from '@nextui-org/react'

export default function Navbar() {
  return (
    <NextNavbar className="items-center mb-6 bg-stone-600">
      <NavbarBrand className="justify-center">
        <p className="font-medium text-3xl text-inherit">SST Blog Prototype</p>
      </NavbarBrand>
    </NextNavbar>
  )
}
