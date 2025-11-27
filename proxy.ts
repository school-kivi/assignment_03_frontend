import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  if (pathname.startsWith('/home')) {
    // Check for authentication token in various places
    const authToken = 
      request.cookies.get('firebase-token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '') ||
      request.nextUrl.searchParams.get('token');
    
    // If no token is found, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Optional: You can add token validation here if you set up Firebase Admin
    // For now, we'll trust that a token exists
    
    // Allow the request to continue
    return NextResponse.next();
  }
  
  // For non-protected routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};