# Fix Email Verification Redirect URL

## Problem
Email verification links are redirecting to `http://localhost:3000` instead of your production URL (e.g., `https://your-app.vercel.app`).

## Solution

### Step 1: Configure Supabase Redirect URLs

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **URL Configuration**

2. **Add Production URL to Redirect URLs**
   - Find the **Redirect URLs** section
   - Add your production URL: `https://your-app.vercel.app/auth/callback`
   - Also keep: `http://localhost:3000/auth/callback` (for development)
   - Click **Save**

3. **Update Site URL**
   - Set **Site URL** to your production URL: `https://your-app.vercel.app`
   - This is the default redirect when no specific URL is provided

### Step 2: Verify Email Template (Optional)

1. Go to **Authentication** → **Email Templates**
2. Click on **Confirm signup**
3. Ensure the confirmation link uses: `{{ .ConfirmationURL }}`
4. This will automatically use the correct redirect URL

## How It Works

The code in `AuthContext.tsx` uses:
```typescript
emailRedirectTo: `${window.location.origin}/auth/callback`
```

This means:
- When signing up from **localhost**, it redirects to `http://localhost:3000/auth/callback`
- When signing up from **production**, it redirects to `https://your-app.vercel.app/auth/callback`

**Important:** Supabase must have both URLs in the allowed redirect URLs list, otherwise it will reject the redirect.

## Testing

1. **Test on Production:**
   - Deploy your app to Vercel
   - Register a new account from the production URL
   - Check email - the link should now point to your production URL

2. **Test on Local:**
   - Register from localhost
   - Email link should point to localhost (for development)

## Common Issues

- **Still redirecting to localhost?** Make sure you're registering from the production URL, not localhost
- **Redirect URL not allowed error?** Add the URL to Supabase redirect URLs list
- **Email not arriving?** Check spam folder and verify email settings in Supabase
