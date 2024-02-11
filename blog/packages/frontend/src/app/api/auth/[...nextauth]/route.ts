import NextAuth from 'next-auth';
import Cognito from "next-auth/providers/cognito"

const handler = NextAuth({
  providers: [
    Cognito({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.user = {
          email: profile!.email
        }
      }

      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user = token.user

      return session
    }
  }
});
export { handler as GET, handler as POST };