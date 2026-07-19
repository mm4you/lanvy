import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'hsk_game_session';

export function middleware(request: NextRequest) {
  const reqUrl = request.nextUrl;
  
  // Protect admin API routes at middleware level
  if (reqUrl.pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
