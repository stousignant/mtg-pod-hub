# Database Migrations

These SQL files need to be run in the Supabase SQL Editor in order.

## Setup Instructions

### 1. Run Migrations

Execute the following SQL files in order in the Supabase SQL Editor:

1. **001_user_profiles.sql** - Creates user profiles table with admin flag
2. **002_admin_rls_policies.sql** - Adds RLS policies for admin-only game writes
3. **003_set_admin_user.sql** - Sets your account as admin (update email first!)

### 2. Configure Google OAuth

#### In Google Cloud Console:

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Application type: **Web application**
7. Add **Authorized JavaScript origins**:
   - `http://localhost:8080`
   - `https://your-production-domain.com`
8. Add **Authorized redirect URIs**:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
9. Copy **Client ID** and **Client Secret**

#### In Supabase Dashboard:

1. Navigate to **Authentication → Providers**
2. Find **Google** and click to enable
3. Paste **Client ID** and **Client Secret** from Google
4. Click **Save**

5. Navigate to **Authentication → URL Configuration**
6. Set **Site URL**:
   - Development: `http://localhost:8080`
   - Production: `https://your-production-domain.com`
7. Add **Redirect URLs**:
   - `http://localhost:8080`
   - `https://your-production-domain.com`

### 3. Set Admin User

After completing OAuth setup:

1. Sign in to your app using Google OAuth
2. Go to Supabase SQL Editor
3. Open **003_set_admin_user.sql**
4. Replace `'your-email@example.com'` with your actual Google email
5. Execute the SQL

### 4. Environment Variables

Ensure your `.env` file has:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Verification

1. Sign in with Google
2. Check that user profile was created:
   ```sql
   SELECT * FROM user_profiles;
   ```
3. Verify admin flag is set:
   ```sql
   SELECT email, is_admin FROM user_profiles WHERE email = 'your-email@example.com';
   ```
4. Try accessing `/admin` route (should work for admin user)
5. Try recording a game (should work for admin user)

## Security Notes

- RLS is enabled on all tables
- Only admins can insert games and game results
- Users cannot modify their own `is_admin` flag
- All policies are server-side enforced
- Admin flag can only be set via direct SQL by database owner
