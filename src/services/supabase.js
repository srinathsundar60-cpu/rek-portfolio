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

/**
 * Parses a Supabase auth error and returns a clean, user-friendly message.
 * Specifically detects rate limiting (429 / over_email_send_rate_limit).
 */
export const getFriendlyAuthErrorMessage = (err) => {
  if (!err) return 'An unknown error occurred.';

  console.error('Auth Error Caught:', {
    message: err.message,
    status: err.status,
    statusCode: err.statusCode,
    status_code: err.status_code,
    code: err.code,
    raw: err
  });

  const isRateLimit = 
    err.status === 429 ||
    err.statusCode === 429 ||
    err.status_code === 429 ||
    err.code === 'over_email_send_rate_limit' ||
    (err.message && (
      err.message.toLowerCase().includes('rate_limit') ||
      err.message.toLowerCase().includes('rate limit') ||
      err.message.toLowerCase().includes('once every') ||
      err.message.toLowerCase().includes('security purposes') ||
      err.message.toLowerCase().includes('too many')
    ));

  if (isRateLimit) {
    return 'Too many email requests have been made. Please wait a few minutes before trying again.';
  }

  return err.message || 'An error occurred during authentication.';
};

