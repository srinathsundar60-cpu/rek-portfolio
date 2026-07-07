import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dfphgwoaklhdmbyaktdn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AhGuklfpJke9wIYSYe5cVA_V_8sk_5A';

// Main client: handles standard sessions and persists credentials in localStorage
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Secondary client: has persistSession disabled.
// This allows the logged-in admin to register new members through Auth.signUp()
// without overwriting their own session storage and logging out.
export const supabaseNoPersist = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
