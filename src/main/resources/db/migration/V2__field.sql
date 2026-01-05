CREATE TABLE field (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournament(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_field_tournament_name UNIQUE (tournament_id, name)
);

CREATE INDEX idx_field_tournament_id ON field(tournament_id);
