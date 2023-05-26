"use client"; // Supabase auth needs to be triggered client-side

import { useAuth } from "@/hooks/useAuth";

export const SignIn = () => {
  const { signInWithGoogle } = useAuth();

  return <button onClick={() => signInWithGoogle()}>Sign in with Google</button>;
};
