-- Run this in your Supabase SQL Editor to FORCE RESET the admin password
-- This ensures 'admin@clouds.com' is confirmed and has the correct password.

-- 1. Ensure the PGCrypto extension is enabled for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Update the admin user (only if they exist)
UPDATE auth.users
SET 
  encrypted_password = crypt('Password@26', gen_salt('bf')),
  email_confirmed_at = now(),
  last_sign_in_at = now(),
  raw_app_meta_data = '{"provider":"email","providers":["email"]}',
  raw_user_meta_data = '{"full_name":"Admin Commander"}'
WHERE email = 'admin@clouds.com';

-- 3. If the user doesn't exist for some reason, create them
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 
    'admin@clouds.com', crypt('Password@26', gen_salt('bf')), 
    now(), now(), now(), 
    '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Commander"}', 
    now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@clouds.com'
);

-- 4. Ensure identity exists (Required for login)
INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, 
    last_sign_in_at, created_at, updated_at
)
SELECT 
    uuid_generate_v4(), id, format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb, 
    'email', id::text, now(), now(), now()
FROM auth.users
WHERE email = 'admin@clouds.com'
AND NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'admin@clouds.com')
);

-- 5. Verification output
SELECT id, email, email_confirmed_at, last_sign_in_at FROM auth.users WHERE email = 'admin@clouds.com';
