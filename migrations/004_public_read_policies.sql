-- Enable RLS and allow public read access on lookup tables
-- These tables need to be readable by all authenticated users
-- for the game entry form dropdowns to work

ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on pods"
  ON pods FOR SELECT
  USING (true);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on players"
  ON players FOR SELECT
  USING (true);

ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on decks"
  ON decks FOR SELECT
  USING (true);
