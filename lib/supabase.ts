import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://example.supabase.co') {
    console.error("Supabase credentials missing! Check your .env.local file.");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
