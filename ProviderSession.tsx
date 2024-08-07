'use client';

import { SessionProvider } from "next-auth/react";

export default function ProviderSession({children, session}: {children: any, session: any}){
    return(
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}