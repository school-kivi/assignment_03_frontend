import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  UserCredential,
  User,
} from 'firebase/auth';
import { auth } from './config';

// Helper function to set auth cookie
const setAuthCookie = async (user: User) => {
  if (user) {
    const token = await user.getIdToken();
    document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
  }
};

// Helper function to clear auth cookie
const clearAuthCookie = () => {
  document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setAuthCookie(userCredential.user);
    return userCredential;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign up';
    throw new Error(message);
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await setAuthCookie(userCredential.user);
    return userCredential;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign in';
    throw new Error(message);
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await setAuthCookie(userCredential.user);
    return userCredential;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
    throw new Error(message);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearAuthCookie();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign out';
    throw new Error(message);
  }
};

// Get current user's ID token
export const getCurrentUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};
