import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vefzbxyrcymbybvmhoic.supabase.co";
const SUPABASE_KEY = "ここにPublishable key";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);