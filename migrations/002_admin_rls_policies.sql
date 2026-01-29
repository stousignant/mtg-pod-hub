-- RLS policies for admin-only game writes
-- Run this in Supabase SQL Editor

-- Add created_by tracking to games table
ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Games table RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view games"
  ON public.games FOR SELECT USING (true);

CREATE POLICY "Admins can insert games"
  ON public.games FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Game results table RLS
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game results"
  ON public.game_results FOR SELECT USING (true);

CREATE POLICY "Admins can insert game results"
  ON public.game_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
