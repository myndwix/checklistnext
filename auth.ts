import NextAuth, {type DefaultSession} from "next-auth"
import {JWT} from 'next-auth/jwt'
import authConfig from "./auth.config";

// declare module "next-auth" {
//   interface User {
//     // Add your additional properties here:
//     lastname?: string | null;
//     username: string
//   }
//   interface Session extends DefaultSession {
//     user: DefaultSession["user"] & {
//       lastname: string;
//       username: string
//     };
//   }
// }
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {strategy: 'jwt'},
  ...authConfig,
  callbacks: {
    async jwt({token, user, session}){
      if(user)
        return {
        ...token,
        username: user.username,
        role: user.role,
        lastname: user.lastname,
        userid: user.userid,
        signature: user.signature
      
      }
      return token
    },
    async session({session, token, user}){
      console.log('SessionCallToken: ',token)
      
        session.user.username = token.username
        session.user.lastname = token.lastname
        session.user.role = token.role
        session.user.userid = token.userid
        session.user.signature = token.signature
        
      return session;
    }
  },
})