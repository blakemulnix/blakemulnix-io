"use client"
import React from 'react'
import { Navbar as NextNavbar, NavbarBrand, NavbarContent, Button, NavbarItem } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function PageLink({ href, text, isActive }: { href: string; text: string; isActive?: boolean }) {
  return (
    <NavbarItem>
      <Link href={href}>
        <button className={`hover:underline hover:scale-125 ${isActive ? 'underline scale-125': ''}`}>{text}</button>
      </Link>
    </NavbarItem>
  )
}

interface LinkData {
  href: string
  text: string
}

const links: LinkData[] = [
  { href: '/admin', text: 'List' },
  { href: '/admin/create', text: 'Create' },
]

export default function AdminNavbar() {
  const pathname = usePathname()
  console.log('pathname:', pathname)

  return (
    <NextNavbar className="mb-6 bg-default-100" height='5rem' maxWidth='xl'>
      <NavbarBrand className="flex flex-col gap-1 items-start">
        <span className="font-medium text-2xl text-inherit">Blake&apos;s Blog</span>
        <span className="font-medium text-lg tracking-widest text-inherit">Admin Console</span>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" variant='ghost' onClick={() => signOut()}>
            Sign out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  )
}
