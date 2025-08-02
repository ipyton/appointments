import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Redirect to login with the code as a query parameter
  // The GitHub login button component will handle this code
  return NextResponse.redirect(new URL(`/login?code=${code}`, req.url));
} 