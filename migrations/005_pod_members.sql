CREATE TABLE public.pod_members (
  pod_id BIGINT NOT NULL REFERENCES public.pods(id) ON DELETE CASCADE,
  player_id BIGINT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  PRIMARY KEY (pod_id, player_id)
);

ALTER TABLE public.pod_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pod members"
  ON public.pod_members FOR SELECT USING (true);

CREATE POLICY "Admins can manage pod members"
  ON public.pod_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
