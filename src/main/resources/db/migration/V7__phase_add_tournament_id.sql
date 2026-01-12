-- Add missing FK column required by Phase -> Tournament mapping
ALTER TABLE phase
  ADD COLUMN tournament_id uuid;

ALTER TABLE phase
  ADD CONSTRAINT fk_phase_tournament
  FOREIGN KEY (tournament_id) REFERENCES tournament(id)
  ON DELETE CASCADE;

ALTER TABLE phase
  ALTER COLUMN tournament_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_phase_tournament_id ON phase(tournament_id);
