-- Create a pod and its player memberships as one atomic operation.
-- SECURITY INVOKER preserves the existing admin-only RLS policies on both tables.

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
BEGIN
  IF NULLIF(BTRIM(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Pod name is required';
  END IF;

  IF COALESCE(CARDINALITY(p_player_ids), 0) = 0 THEN
    RAISE EXCEPTION 'Select at least one player';
  END IF;

  INSERT INTO public.pods (name)
  VALUES (BTRIM(p_name))
  RETURNING * INTO new_pod;

  INSERT INTO public.pod_members (pod_id, player_id)
  SELECT new_pod.id, selected.player_id
  FROM UNNEST(p_player_ids) AS selected(player_id)
  GROUP BY selected.player_id;

  RETURN new_pod;
END;
$$;

REVOKE ALL ON FUNCTION public.create_pod_with_players(TEXT, BIGINT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_pod_with_players(TEXT, BIGINT[]) TO authenticated;