-- Run this in Supabase SQL Editor to automatically confirm all new emails
-- and confirm existing unconfirmed users.

-- 1. Confirm all existing users who haven't confirmed yet
UPDATE auth.users 
SET email_confirmed_at = now(),
    confirmed_at = now(),
    last_sign_in_at = COALESCE(last_sign_in_at, now())
WHERE email_confirmed_at IS NULL;

-- 2. Create a function to auto-confirm new signups
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = now(),
      confirmed_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger that runs on every new user insertion
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_confirmation();

-- 4. Informational note
-- For production, you usually want email confirmation, but for this dev stage
-- we are bypassing it as requested.
