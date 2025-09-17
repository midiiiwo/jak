import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        console.log('Session cookie created:', sessionCookie ? 'success' : 'failed');


    // Build response with cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn / 1000, // seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // must be false in dev
      sameSite: 'lax',
      path: '/',
    });
    console.log('Setting cookie:', response.cookies.get('session')?.value);

    return response;
  } catch (error) {
    console.error('Session creation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
