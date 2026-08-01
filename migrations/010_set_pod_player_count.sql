-- Fix pod creation for the production schema, where pods.player_count is NOT NULL.
-- Derive the stored count from the same deduplicated player IDs used for memberships.

CREATE OR REPLACE FUNCTION public.create_pod_with_players(
  p_name TEXT,
  p_player_ids BIGINT[]
)
RETURNS public.pods
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_pod public.pods;
  selected_player_count INTEGER;
BEGIN
  IF NULLIF(BTRIM(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Pod name is required';
  END IF;

  SELECT COUNT(DISTINCT player_id)::INTEGER
  INTO selected_player_count
  FROM UNNEST(p_player_ids) AS selected(player_id)
  WHERE player_id IS NOT NULL;

  IF selected_player_count = 0 THEN
    RAISE EXCEPTION 'Select at least one player';
  END IF;

  INSERT INTO public.pods (name, player_count)
  VALUES (BTRIM(p_name), selected_player_count)
  RETURNING * INTO new_pod;

  INSERT INTO public.pod_members (pod_id, player_id)
  SELECT new_pod.id, selected.player_id
  FROM UNNEST(p_player_ids) AS selected(player_id)
  WHERE selected.player_id IS NOT NULL
  GROUP BY selected.player_id;

  RETURN new_pod;
END;
$$;

REVOKE ALL ON FUNCTION public.create_pod_with_players(TEXT, BIGINT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_pod_with_players(TEXT, BIGINT[]) TO authenticated;
