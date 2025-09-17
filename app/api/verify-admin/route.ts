import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // Secure server-side admin checks
    const ADMIN_UIDS = process.env.NEXT_PUBLIC_ADMIN_UID?.split(',') || [];
    const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',') || [];
    
    const isAdminByUid = ADMIN_UIDS.includes(uid);
    const isAdminByEmail = ADMIN_EMAILS.includes(email || '');
    const isAdmin = isAdminByUid && isAdminByEmail;

    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Admin access required',
        isAdmin, 
        uid,
        email,
        isAdminByUid,
        isAdminByEmail 
      }, { status: 403 });
    }

    // Create JWT token instead of session cookie
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign(
      { 
        uid: decodedToken.uid, 
        email: decodedToken.email,
        admin: true 
      },
      jwtSecret,
      { expiresIn: '5d' }
    );

    return NextResponse.json({ 
      success: true, 
      token,
      user: {
        uid,
        email,
        isAdmin
      }
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}