-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  host_id TEXT NOT NULL,
  guest_id TEXT,
  host_score INTEGER DEFAULT 0,
  guest_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create player_positions table
CREATE TABLE IF NOT EXISTS public.player_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  position_z FLOAT DEFAULT 0,
  rotation_y FLOAT DEFAULT 0,
  health INTEGER DEFAULT 100,
  is_shooting BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_positions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches (public read/write for multiplayer)
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update matches"
  ON public.matches FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete matches"
  ON public.matches FOR DELETE
  USING (true);

-- RLS Policies for player_positions (public read/write for multiplayer)
CREATE POLICY "Anyone can view positions"
  ON public.player_positions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert positions"
  ON public.player_positions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update positions"
  ON public.player_positions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete positions"
  ON public.player_positions FOR DELETE
  USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_positions;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_positions_updated_at
  BEFORE UPDATE ON public.player_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();