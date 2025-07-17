import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  const isProfile = request.nextUrl.pathname.startsWith('/profile');
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isGamePath = request.nextUrl.pathname.startsWith('/game');
  const isHome = request.nextUrl.pathname === '/';
  const isApi = request.nextUrl.pathname.startsWith('/api/');
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (isApi) {
    return NextResponse.next();
  }

  // If not logged in, redirect to home from protected routes
  if (!user && (isProfile || isAdminPath || isGamePath)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If logged in and on the home page, redirect to profile
  if (user && isHome) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
