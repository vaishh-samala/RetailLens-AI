import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured, auth } from '../../lib/firebase';
import { GoogleUser } from '../../types';

export function mapFirebaseUser(user: FirebaseUser): GoogleUser {
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || (user.email ? user.email.split('@')[0] : 'RetailLens User'),
    avatarUrl: user.photoURL || '',
    provider: 'google',
    lastLogin: user.metadata?.lastSignInTime || new Date().toISOString(),
  };
}

class AuthService {
  /**
   * Check if Firebase credentials have been configured in environment variables.
   */
  public isConfigured(): boolean {
    return isFirebaseConfigured;
  }

  /**
   * Returns current authenticated user, if available.
   */
  public getCurrentUser(): GoogleUser | null {
    if (!auth?.currentUser) {
      return null;
    }
    return mapFirebaseUser(auth.currentUser);
  }

  /**
   * Initiates real Google sign-in through Firebase Authentication popup.
   */
  public async signInWithGoogle(): Promise<GoogleUser> {
    if (!isFirebaseConfigured) {
      throw new Error(
        'Firebase configuration is missing. Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID in your .env file.'
      );
    }

    try {
      const firebaseAuth = getFirebaseAuth();
      const provider = getGoogleProvider();
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      return mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      console.error('[RetailLens AI] Firebase Google sign-in failed:', error);
      throw new Error(this.formatAuthError(error));
    }
  }

  /**
   * Signs the user out from Firebase Authentication and clears local session.
   */
  public async signOut(): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    try {
      const firebaseAuth = getFirebaseAuth();
      await firebaseSignOut(firebaseAuth);
    } catch (error: any) {
      console.error('[RetailLens AI] Firebase sign-out failed:', error);
      throw new Error(this.formatAuthError(error));
    }
  }

  /**
   * Subscribes to Firebase Authentication state listener.
   * This handles persistent sessions across browser refreshes and tab reloads.
   */
  public subscribeToAuthState(callback: (user: GoogleUser | null) => void): () => void {
    if (!isFirebaseConfigured) {
      callback(null);
      return () => {};
    }

    try {
      const firebaseAuth = getFirebaseAuth();
      return onAuthStateChanged(
        firebaseAuth,
        (firebaseUser) => {
          if (firebaseUser) {
            callback(mapFirebaseUser(firebaseUser));
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('[RetailLens AI] Auth state change error:', error);
          callback(null);
        }
      );
    } catch (error) {
      console.error('[RetailLens AI] Unable to bind Firebase auth listener:', error);
      callback(null);
      return () => {};
    }
  }

  /**
   * Converts Firebase AuthError codes into clear, user-friendly messages.
   */
  private formatAuthError(error: any): string {
    const code = (error as AuthError)?.code || '';

    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was canceled: The Google sign-in window was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in request was canceled because another sign-in operation was started.';
      case 'auth/popup-blocked':
        return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site and retry.';
      case 'auth/network-request-failed':
        return 'Network error: Unable to connect to Firebase. Please check your internet connection and try again.';
      case 'auth/unauthorized-domain':
        return 'Domain not authorized: Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. In Firebase Console, go to Authentication > Sign-in method and enable the Google provider.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      case 'auth/api-key-not-valid':
        return 'Invalid Firebase API Key: Please check your Firebase project API Key in the Firebase Console and ensure Google Identity Toolkit API is enabled.';
      default:
        return error.message || 'Unable to complete Google authentication. Please try again.';
    }
  }
}

export const authService = new AuthService();
