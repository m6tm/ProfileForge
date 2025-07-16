import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  const isDashboard = request.nextUrl.pathname.startsWith('/profile');
  const isHome = request.nextUrl.pathname === '/';
  const isApi = request.nextUrl.pathname.startsWith('/api/');
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser()

  if (isApi) {
    return NextResponse.next();
  }

  if (!data.user && isDashboard) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (data.user && isHome) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}