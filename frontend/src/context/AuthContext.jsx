import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is returning from a redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error("Redirect result error:", err);
        if (err.code && err.code !== "auth/credential-already-in-use") {
          if (err.code === "auth/configuration-not-found") {
            setError(
              "Google Sign-in is not enabled in your Firebase project. Please enable 'Google' under Authentication > Sign-in method in Firebase Console."
            );
          } else {
            setError(err.message);
          }
        }
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("Auth state error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setSigningIn(true);
    setError(null);

    try {
      // First attempt with popup
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setSigningIn(false);
      return result.user;
    } catch (err) {
      console.error("Google sign-in error:", err);

      // If the browser blocked the popup, seamlessly fallback to redirect mode
      if (err.code === "auth/popup-blocked") {
        console.warn("Popup blocked by browser. Automatically falling back to redirect flow...");
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error("Redirect fallback failed:", redirectErr);
          setError(
            "Popup was blocked by your browser. Please allow popups for this site in your address bar, or try again."
          );
          setSigningIn(false);
          throw redirectErr;
        }
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled (popup closed).");
        setSigningIn(false);
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "Current domain is not authorized in Firebase Console. Please add 'localhost' to Authorized Domains in Firebase Authentication Settings."
        );
        setSigningIn(false);
      } else if (err.code === "auth/configuration-not-found") {
        setError(
          "Google Sign-in is not enabled in your Firebase project. Please enable 'Google' under Authentication > Sign-in method in Firebase Console."
        );
        setSigningIn(false);
      } else {
        setError(err.message || "Failed to sign in with Google.");
        setSigningIn(false);
      }
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Sign-out error:", err);
      setError(err.message || "Failed to sign out.");
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    signingIn,
    error,
    signInWithGoogle,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
