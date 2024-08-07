'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import * as z from 'zod'

const formSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(3, {
      message: "Password must be at least 3 characters.",
    }),
  })

export const LogIn = async (values: z.infer<typeof formSchema>) => {
    const validateFields = formSchema.safeParse(values);
    if(!validateFields.success)
        return ({error: 'Invalid Fields'});

    const {username, password} = validateFields.data;
    try{
        await signIn('credentials', {
            username,
            password,
            redirectTo: '/checklists'
        });
    }catch (error) {
        if(error instanceof AuthError){
            switch (error.type){
            case 'CredentialsSignin':
              return {error: 'Invalid Credentials'} 
            default:
              return {error: 'Something went wrong'}
          }
        }
        throw error
      }
} 