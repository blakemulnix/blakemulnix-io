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
});
export { handler as GET, handler as POST };