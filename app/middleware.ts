import { NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/auth',
  '/health',
  '/api/health',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Security headers
  const response = NextResponse.next()

  // HSTS — enforce HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Content Security Policy (adjust as needed)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  )

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), usb=()'
  )

  // Add request ID for tracking
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)

  // Log request (optional)
  console.log(`[${requestId}] ${request.method} ${pathname}`)

  // Check authentication for protected routes
  if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Optional: Verify token validity
    try {
      // Add token verification logic here if needed
      // const decoded = await verifyToken(token)
      // if (!decoded) throw new Error('Invalid token')
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return response
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    // Apply to all routes except static files and public assets
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
