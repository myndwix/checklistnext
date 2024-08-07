import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      // lastname: string;
      // role: number;
    } & DefaultSession["user"]
  }

  interface User {
        // Add your additional properties here:
        lastname: string | null;
        username: string;
        role: number;
        userid: number;
        signature: string
      }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    username: string
  }
}