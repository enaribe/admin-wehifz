import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_DAYS = 5;

// Firebase Auth REST API endpoint
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // 1. Vérifier les credentials avec Firebase Auth REST API
    const authResponse = await fetch(FIREBASE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      // Firebase Auth error codes
      const errorCode = authData.error?.message;
      let errorMessage = 'Email ou mot de passe incorrect';

      if (errorCode === 'EMAIL_NOT_FOUND' || errorCode === 'INVALID_EMAIL') {
        errorMessage = 'Email non trouvé';
      } else if (errorCode === 'INVALID_PASSWORD' || errorCode === 'INVALID_LOGIN_CREDENTIALS') {
        errorMessage = 'Mot de passe incorrect';
      } else if (errorCode === 'USER_DISABLED') {
        errorMessage = 'Ce compte a été désactivé';
      }

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    const { localId: uid } = authData;

    // 2. Vérifier le rôle admin dans Firestore
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé dans la base de données' },
        { status: 403 }
      );
    }

    const userData = userDoc.data();

    if (userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Vous devez être administrateur.' },
        { status: 403 }
      );
    }

    // 3. Créer un token de session
    const sessionToken = Buffer.from(
      JSON.stringify({
        uid,
        email,
        role: 'admin',
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      })
    ).toString('base64');

    // 4. Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        uid,
        email,
        displayName: userData?.displayName || email.split('@')[0],
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
