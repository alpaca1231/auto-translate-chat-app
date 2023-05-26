"use client";

import { supabaseClient } from "@/lib/supabase-client";

export const useAuth = () => {
  const supabase = supabaseClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { signInWithGoogle, signOut };
};
