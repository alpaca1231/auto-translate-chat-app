import { useSupabase } from "@/lib/supabase-provider";

const USERS_TABLE = "users";
export const useAuth = () => {
  const { supabase } = useSupabase();

  // Email signUp
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
    if (!data?.user) return;
    await supabase.from(USERS_TABLE).insert([{ id: data.user.id, name: "guest", language: "ja" }]);
    return data;
  };

  // Email signIn
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return { signUp, signIn, signOut };
};
