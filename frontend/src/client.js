import { createClient } from "@supabase/supabase-js";

// Create Supabase clien using project's url and anon/public key 
const supabase = createClient(
  "https://mdejummjvrfttoxxtrwx.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;