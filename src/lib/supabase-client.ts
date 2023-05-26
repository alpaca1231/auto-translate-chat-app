import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/database.types";

// client-side supabase client
export const supabaseClient = () => createClientComponentClient<Database>();
