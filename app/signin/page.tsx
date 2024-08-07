"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AuthError } from "next-auth";
import { LogIn } from "../db/login";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(3, {
    message: "Password must be at least 3 characters.",
  }),
})

export default function Signin() {
  const [error, setError] = useState<string | undefined>('')
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: ""
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        setError('');
        LogIn(values).then(data => {
          setError(data?.error);
        })
      }
  // ...

  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-50">
        <div className="w-96 h-[30rem] p-10 bg-white flex justify-center items-center shadow-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter RC number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {error && <FormMessage>{error}</FormMessage>}
                    <Button style={{marginTop:16}} type="submit">Sign in</Button>
                    
                </form>
            </Form>
        </div>
    </div>
  )
}
