import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { subdomainMiddleware } from './middleware/subdomain'

const CORS_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD'
const DEFAULT_CORS_HEADERS = 'Content-Type, Authorization, X-Requested-With'

function withCorsHeaders(request: NextRequest, response: NextResponse) {
  const requestedHeaders = request.headers.get('access-control-request-headers')
  const requestOrigin = request.headers.get('origin')

  response.headers.set('Vary', 'Origin, Access-Control-Request-Headers')
  response.headers.set('Access-Control-Allow-Methods', CORS_METHODS)
  if (requestOrigin) {
    // Echo request origin to effectively allow all origins with credentials.
    // Using "*" is invalid for credentialed requests.
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  response.headers.set(
    'Access-Control-Allow-Headers',
    requestedHeaders || DEFAULT_CORS_HEADERS
  )
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

// Define protected routes that require authentication
const protectedRoutes = [
  '/restaurant/dashboard',
  '/onboarding/details',
  '/onboarding/menu'
  // '/restaurant/menu' and '/restaurant/' are NOT here, so /restaurant/menu and its subroutes are public
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/onboarding/auth/signin',
  '/onboarding/auth/signup'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname.startsWith('/api')) {
    if (request.method === 'OPTIONS') {
      return withCorsHeaders(request, new NextResponse(null, { status: 204 }))
    }

    return withCorsHeaders(request, NextResponse.next())
  }

  // Debug logging
  console.log('MIDDLEWARE:', { pathname, token })

  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  // Handle subdomain requests
  if (subdomain && subdomain !== 'www' && subdomain !== 'dineinn' && subdomain !== 'localhost') {
    return subdomainMiddleware(request);
  }

  // If not authenticated and on a protected route, redirect to signin
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    console.log('Redirecting to signin from protected route')
    return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
  }

  // If authenticated and on an auth page, redirect to dashboard
  if (token && (pathname === '/onboarding/auth/signin' || pathname === '/onboarding/auth/signup')) {
    console.log('Redirecting to dashboard from auth page')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If authenticated and on home page, redirect to dashboard
  if (token && pathname === '/') {
    console.log('Redirecting to dashboard from home')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If on a protected route and token exists, verify it
  if (protectedRoutes.some(route => pathname.startsWith(route)) && token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      console.log('Token verification failed, redirecting to signin', error)
      return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
    }
  }

  // Otherwise, allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 