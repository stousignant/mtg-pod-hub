-- Set admin flag for your account
-- Run this AFTER your first Google OAuth login
-- Replace 'your-email@example.com' with your actual email

UPDATE user_profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
