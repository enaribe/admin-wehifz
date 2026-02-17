import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

// Routes that don't require authentication
const publicRoutes = ['/', '/landing', '/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes except dashboard-related ones
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/logout')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    // Redirect to login if no session
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Decode and verify token (lightweight check)
    const decoded = JSON.parse(
      Buffer.from(sessionCookie, 'base64').toString('utf-8')
    );

    // Check expiration
    if (decoded.expiresAt < Date.now()) {
      // Session expired, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Check admin role
    if (decoded.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Session valid, continue
    return NextResponse.next();
  } catch {
    // Invalid session, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth/login).*)',
  ],
};
