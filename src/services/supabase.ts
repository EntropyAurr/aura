import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const supabase = createClient<Database>(supabaseUrl, process.env.NEXT_SERVICE_ROLE_KEY!);

export default supabase;
