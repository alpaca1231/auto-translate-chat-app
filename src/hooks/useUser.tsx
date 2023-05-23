"use client";

import { createContext, ReactNode, useState, useEffect, useCallback, useContext } from "react";

import { USERS_TABLE } from "@/constants/tables";
import { useSupabase } from "@/lib/supabase-provider";

import type { User } from "@/types/users.types";

type UserContext = User | null;

const Context = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContext>(null);
  const { supabase } = useSupabase();

  const fetchUser = useCallback(
    async (userId: User["id"]) => {
      const { data, error } = await supabase
        .from(USERS_TABLE)
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
    },
    [supabase]
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session || event === "SIGNED_OUT") {
        setUser(null);
        return;
      }
      if (event === "SIGNED_IN") {
        await fetchUser(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Context.Provider value={user}>{children}</Context.Provider>;
};
export const useUser = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
