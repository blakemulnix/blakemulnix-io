import NextAuth from "next-auth"

console.log("next-auth.d.ts ###############")

declare module "next-auth" {
  interface Session {
    accessToken: string | undefined
    user?: {
      email?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    user?: {
      email?: string
    }
  }
}