import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Basic validation to check if credentials are likely valid
// Standard Supabase anon keys start with "ey" (JWTs). 
// The "sb_publishable_" format might be used in some newer Supabase configurations,
// but let's be careful as it can lead to authentication loops if misconfigured.
export const isSupabaseConfigured =
    !!supabaseUrl &&
    !!supabaseKey &&
    supabaseUrl !== 'https://example.supabase.co' &&
    supabaseUrl !== 'your-project-url' &&
    // Check if it's a valid non-placeholder URL
    supabaseUrl.startsWith('https://');

if (!isSupabaseConfigured) {
    console.warn("Supabase credentials missing or invalid! Using mock/fallback data to prevent crashing loops.");
}

// Ensure we don't pass undefined/empty strings that cause createBrowserClient to throw
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://example.supabase.co';
const validKey = isSupabaseConfigured ? supabaseKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.m0-fake-key-to-prevent-crash';

export const supabase = createBrowserClient(validUrl, validKey);
