import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "@/types/database.types";

// server-side supabase client
export const serverClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });

// server-action supabase client (Server Actions are currently in Alpha and likely to change.)
export const serverActionClient = () =>
  createServerActionClient<Database>({
    cookies,
  });

// route-handler supabase client
export const routeHandlerClient = () =>
  createRouteHandlerClient<Database>({
    cookies,
  });
