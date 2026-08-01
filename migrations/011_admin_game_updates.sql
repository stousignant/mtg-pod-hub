-- Atomically update an existing game and replace its results.
-- SECURITY INVOKER intentionally leaves authorization to table RLS.

DROP POLICY IF EXISTS "Admins can update games" ON public.games;
CREATE POLICY "Admins can update games"
  ON public.games FOR UPDATE
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

DROP POLICY IF EXISTS "Admins can delete game results" ON public.game_results;
CREATE POLICY "Admins can delete game results"
  ON public.game_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE OR REPLACE FUNCTION public.update_game_with_results(
  p_game_id BIGINT,
  p_pod_id BIGINT,
  p_played_at DATE,
  p_notes TEXT,
  p_results JSONB
)
RETURNS public.games
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_game public.games;
BEGIN
  IF jsonb_typeof(p_results) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_results) = 0 THEN
    RAISE EXCEPTION 'Game results must be a non-empty JSON array';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.games WHERE id = p_game_id) THEN
    RAISE EXCEPTION 'Game % does not exist', p_game_id;
  END IF;

  UPDATE public.games
  SET pod_id = p_pod_id,
      played_at = p_played_at,
      notes = p_notes
  WHERE id = p_game_id
  RETURNING * INTO v_game;

  DELETE FROM public.game_results WHERE game_id = p_game_id;

  INSERT INTO public.game_results
    (game_id, player_id, deck_id, outcome, unsatisfying)
  SELECT
    p_game_id,
    typed.player_id,
    typed.deck_id,
    typed.outcome,
    COALESCE(typed.unsatisfying, false)
  FROM jsonb_populate_recordset(
    NULL::public.game_results,
    p_results
  ) AS typed;

  RETURN v_game;
END;
$$;

REVOKE ALL ON FUNCTION public.update_game_with_results(BIGINT, BIGINT, DATE, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_game_with_results(BIGINT, BIGINT, DATE, TEXT, JSONB) TO authenticated;
