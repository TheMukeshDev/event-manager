import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/admin/login']
const ADMIN_ROUTES = ['/admin/dashboard', '/admin/settings', '/admin/users', '/admin/sponsors', '/admin/certificates']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)
  const isProtectedRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  const isAdminHome = pathname === '/admin'

  const adminSession = request.cookies.get('admin_session')

  if (isAdminHome) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (isProtectedRoute && !adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isPublicRoute && adminSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
