"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState, useEffect, useContext, useCallback } from "react";

import { USERS_TABLE } from "@/constants/tables";
import { supabaseClient } from "@/lib/supabase-client";

import type { User, UserContext } from "@/types/users.types";

const Context = createContext<UserContext>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContext>(null);
  const router = useRouter();
  const { fetchUser } = useUser();
  const supabase = supabaseClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (!session || event === "SIGNED_OUT") {
          setUser(null);
          router.refresh();
          return;
        }
        if (event === "SIGNED_IN") {
          const { data, error } = await fetchUser(session.user.id);
          if (error) throw error;
          setUser(data);
        }
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUser, supabase]);

  return <Context.Provider value={user}>{children}</Context.Provider>;
};

export const useUser = () => {
  const user = useContext(Context);
  const supabase = supabaseClient();

  const fetchUser = useCallback(
    async (userId: User["id"]) => {
      return supabase.from(USERS_TABLE).select("*").eq("id", userId).single();
    },
    [supabase]
  );

  return { user, fetchUser };
};
