-- Allow authenticated administrators to create pods.
-- Pods remain read-only for non-admin users; no UPDATE or DELETE policy is granted.

DROP POLICY IF EXISTS "Admins can insert pods" ON public.pods;
CREATE POLICY "Admins can insert pods"
  ON public.pods FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
