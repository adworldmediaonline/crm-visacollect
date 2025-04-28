import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for authentication token in cookies
    const token = request.cookies.get('token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/';

    // If the user is not authenticated and trying to access any page other than login
    if (!token && !isLoginPage) {
        const loginUrl = new URL('/', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated and trying to access the login page
    if (token && isLoginPage) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
