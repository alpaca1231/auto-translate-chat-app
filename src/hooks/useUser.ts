import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/types/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const { session } = useAuth();
  const sessionUser = session?.user;

  const getUser = useCallback(async () => {
    if (!sessionUser) return;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", sessionUser.id)
      .single();

    if (error) {
      throw error;
    }
    setUser(data);

    return data;
  }, [sessionUser]);

  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, [getUser]);

  return { user, getUser };
};
