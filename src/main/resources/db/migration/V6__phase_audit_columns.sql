-- Add audit timestamps to phase to match Phase.java mappings

ALTER TABLE phase
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_phase_updated_at ON phase;

CREATE TRIGGER trg_phase_updated_at
BEFORE UPDATE ON phase
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
