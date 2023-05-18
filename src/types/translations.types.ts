import { Database } from "@/types/database.types";

export type Translation = Database["public"]["Tables"]["translations"]["Row"];

export type TranslateAPIResponse = {
  message: string;
};
