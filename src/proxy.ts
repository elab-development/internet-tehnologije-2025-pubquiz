import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import * as jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // ako neko pokusa na /admin, a nema token, salji ga na login
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Provera uloge direktno u middleware-u
      const payload = jwt.decode(token) as any;
      
      if (payload?.role !== 'ADMIN') {
        // ulogovan sli nije admin, salji na pocetnu
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  //  pokreće isključivo za rute koje počinju sa /admin/
  //  :path* bilo šta što ide posle toga
  matcher: ['/admin/:path*'],
};