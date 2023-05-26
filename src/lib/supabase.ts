import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "@/types/database.types";

// client-side supabase client
export const supabaseClient = () => createClientComponentClient<Database>();

// server-side supabase client
export const serverClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });

// server-action supabase client
export const serverActionClient = () =>
  createServerActionClient<Database>({
    cookies,
  });

// route-handler supabase client
export const routeHandlerClient = () =>
  createRouteHandlerClient<Database>({
    cookies,
  });
