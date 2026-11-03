import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://vefzbxyrcymbybvmhoic.supabase.co";
const SUPABASE_KEY = "sb_publishable_B1q0FL17VPMxq8c_b_jb9Q_W7RQ7dLD";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);