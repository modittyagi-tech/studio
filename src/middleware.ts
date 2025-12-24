
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAdminDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  // If user is on an admin page but not logged in, redirect to login
  if (!session && !isLoginPage && req.nextUrl.pathname.startsWith('/admin')) {
     if (req.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
     }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }
  
  if (session && req.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }


  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
