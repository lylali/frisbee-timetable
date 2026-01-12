CREATE TABLE IF NOT EXISTS phase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES division(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_phase_division_id ON phase(division_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_phase_division_order
  ON phase(division_id, order_index);
