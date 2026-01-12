ALTER TABLE game
  ALTER COLUMN status SET DEFAULT 'SCHEDULED';

ALTER TABLE game
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_game_division_id ON game(division_id);
CREATE INDEX IF NOT EXISTS idx_game_timeslot_id ON game(timeslot_id);
CREATE INDEX IF NOT EXISTS idx_game_pitch_id ON game(pitch_id);
