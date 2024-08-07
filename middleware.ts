import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";


//public routes /
// auth routes = /auth/login /auth/register
// auth prefix = /api/auth
// default routes /settings

const {auth} = NextAuth(authConfig);
const publicRoutes = ['/']
const authRoutes = ['/login']
const apiAuthPrefix = '/api/auth'
const defaultRedirect = '/checklists'


export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth
    console.log('isLogged: ', isLoggedIn)

    const isApiAuthRoute = nextUrl.pathname.startsWith('/api')
    const isPublicRoute = ['/'].includes(nextUrl.pathname)
    const isAuthRoute = ['/signin'].includes(nextUrl.pathname)

    
    if(isApiAuthRoute)
        return

    if(isAuthRoute){
        if(isLoggedIn)
            return Response.redirect(new URL(defaultRedirect, nextUrl))
        return 

    }
    if(!isLoggedIn && !isPublicRoute)
    return Response.redirect(new URL('/signin', nextUrl))



        
    
})


export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };
