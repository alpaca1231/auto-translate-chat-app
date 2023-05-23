import { fetchMessages } from "@/lib/supabase";

import { Database } from "@/types/database.types";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageResponse = Awaited<ReturnType<typeof fetchMessages>>;
