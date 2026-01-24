'use client';
import {
  Auth, // Import Auth type for type hinting
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiate email/password sign-up. Returns promise from Firebase SDK. */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string
) {
  // Returns the promise to be handled by the caller
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in. Returns promise from Firebase SDK. */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string
) {
  // Returns the promise to be handled by the caller
  return signInWithEmailAndPassword(authInstance, email, password);
}
