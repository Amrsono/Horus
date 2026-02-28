-- SQL query to create users in Supabase
-- Run this in your Supabase Project > SQL Editor

-- 1. Create Admin User
-- Note: 'password123' is a placeholder. In production, users should sign up properly.
-- However, for seeding data, we can try to insert into auth.users if we have the hash.
-- A better approach for SQL Editor is to just create the user entry and allow them to recover password,
-- BUT Supabase doesn't allow easy plaintext password setting via raw SQL for security.

-- EASIEST METHOD: Use the Supabase API helper function if available, or just standard INSERTs
-- for identities.

-- WARNING: Manually inserting into auth.users is risky without correct password hashing (bcrypt).
-- The standard recommendation is to use the Authentication > Users > Add User button in the Dashboard.

-- However, to answer your request for a QUERY, here is a helpful script to inspect or set metadata
-- IF the user already exists, OR to create a simplified entry.

-- Since we cannot generate a valid bcrypt hash easily in standard SQL without pgcrypto:

-- Extension required for hashing (if not enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Insert Admin User (if not exists)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) 
SELECT
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin@horus.com',
    crypt('Password@26', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin Commander"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@horus.com'
);

-- 3. Insert Standard User (if not exists)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'userhorus@horus.com',
    crypt('Password@25', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Horus Agent"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'userhorus@horus.com'
);

-- 4. Insert into auth.identities (Required for login to work properly in some versions)
-- 4. Insert into auth.identities (Required for login to work properly)
-- We insert only if the identity doesn't exist to avoid constraint errors
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(), -- generate a new uuid for identity id
    id,
    format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
    'email',
    id::text,
    now(),
    now(),
    now()
FROM auth.users
WHERE email IN ('admin@horus.com', 'userhorus@horus.com')
AND NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE provider_id = auth.users.id::text AND provider = 'email'
);

-- Verify creation
SELECT id, email, role, created_at FROM auth.users WHERE email IN ('admin@horus.com', 'userhorus@horus.com');
