-- Allow authenticated administrators to create and update decks.
-- RLS was enabled for decks in 004_public_read_policies.sql, but only a
-- SELECT policy was committed, so UPDATE requests were rejected by Supabase.

DROP POLICY IF EXISTS "Admins can insert decks" ON public.decks;
CREATE POLICY "Admins can insert decks"
  ON public.decks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update decks" ON public.decks;
CREATE POLICY "Admins can update decks"
  ON public.decks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
