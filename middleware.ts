import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const publicPaths = ['/admin/login'];

    // If the path is public, allow access
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Check if it's an admin route
    const isAdminRoute = path.startsWith('/admin');

    // Get the session cookie
    const session = request.cookies.get('session')?.value;
console.log("Session cookie:", request.cookies.get("session")?.value);

    // If it's an admin route and no session exists, redirect to login
    if (isAdminRoute && !session) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('from', path);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
