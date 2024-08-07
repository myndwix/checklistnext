import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import { object, string } from "zod"
import Credentials from "next-auth/providers/credentials"
import { getUser } from "./app/db/createchecklist";
import { ZodError, z } from "zod"
import bcrypt from 'bcryptjs'
import axios from "axios";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(3, {
    message: "Password must be at least 3 characters.",
  }),
})

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      async authorize(credentials){
        const validateFields = formSchema.safeParse(credentials);
        if(validateFields.success)
          {
             const {data} = await axios.post('http://localhost:3000/api/user', {username: validateFields.data.username});
             if(data.length<1)
              return null;
              const passwordMatch = await bcrypt.compare(validateFields.data.password, data[0].password) 
             if(passwordMatch){
              // const username = {name: 'Sameen', email: 'myndwix@gmail.com', ...data[0]}
               return data[0]
             }
          }
        return null
      }
    }),
  ],
  pages: {signIn: '/signin'}
} satisfies NextAuthConfig