'use server';

import { auth } from "@/auth";

interface UserSession {
    user: {
      username: string;
      lastname: string;
      role: number;
      userid: number;
      signature: string;
    }
  }

export async function GetSession() : Promise<UserSession | {status: number} | null>{
    try{
       const session = await auth();
       console.log('new Session: ',session)
       return session;
    }catch(err: any){
        console.log(err.message)
        return (err.message, {status: 404})
    }
  }