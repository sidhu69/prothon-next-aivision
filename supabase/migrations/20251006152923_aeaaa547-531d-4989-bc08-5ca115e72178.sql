-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  guest_id UUID,
  host_score INTEGER NOT NULL DEFAULT 0,
  guest_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for matches
CREATE POLICY "Anyone can view matches"
ON public.matches
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create matches"
ON public.matches
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Players can update their matches"
ON public.matches
FOR UPDATE
USING (true);

-- Create player_positions table for real-time position sync
CREATE TABLE public.player_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  position_z REAL NOT NULL,
  rotation_y REAL NOT NULL,
  health INTEGER NOT NULL DEFAULT 100,
  is_shooting BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- Enable RLS
ALTER TABLE public.player_positions ENABLE ROW LEVEL SECURITY;

-- Create policies for player positions
CREATE POLICY "Anyone can view player positions"
ON public.player_positions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert player positions"
ON public.player_positions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update player positions"
ON public.player_positions
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete player positions"
ON public.player_positions
FOR DELETE
USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_positions;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_player_positions_updated_at
BEFORE UPDATE ON public.player_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();