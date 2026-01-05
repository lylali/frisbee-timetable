-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- Tournament core
-- =========================
CREATE TABLE tournament (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  season_year INT,
  start_date DATE,
  end_date DATE,
  timezone TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE division (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournament(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_id UUID NOT NULL REFERENCES division(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  seed INT,
  club TEXT,
  bonus_points INT NOT NULL DEFAULT 0,
  penalty_points INT NOT NULL DEFAULT 0
);

-- =========================
-- Venues & scheduling
-- =========================
CREATE TABLE venue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournament(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

CREATE TABLE pitch (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venue(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  UNIQUE (venue_id, code)
);

CREATE TABLE timeslot (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournament(id) ON DELETE CASCADE,
  day_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  label TEXT,
  UNIQUE (tournament_id, day_date, start_time, end_time)
);

-- =========================
-- Format engine (phases / pools)
-- =========================
CREATE TABLE phase (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_id UUID NOT NULL REFERENCES division(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  rules_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID NOT NULL REFERENCES phase(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE pool_team (
  pool_id UUID NOT NULL REFERENCES pool(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  initial_rank INT,
  PRIMARY KEY (pool_id, team_id)
);

-- =========================
-- Games & results
-- =========================
CREATE TABLE game (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_id UUID NOT NULL REFERENCES division(id) ON DELETE CASCADE,
  phase_id UUID NOT NULL REFERENCES phase(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES pool(id) ON DELETE SET NULL,

  round_label TEXT,
  game_number INT,

  timeslot_id UUID REFERENCES timeslot(id) ON DELETE SET NULL,
  pitch_id UUID REFERENCES pitch(id) ON DELETE SET NULL,

  team1_id UUID REFERENCES team(id) ON DELETE SET NULL,
  team2_id UUID REFERENCES team(id) ON DELETE SET NULL,

  team1_source TEXT,
  team2_source TEXT,

  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  score1 INT,
  score2 INT,
  is_universe BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Cached standings (optional but recommended)
-- =========================
CREATE TABLE standing_snapshot (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID NOT NULL REFERENCES phase(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES pool(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,

  gp INT NOT NULL,
  w INT NOT NULL,
  d INT NOT NULL,
  l INT NOT NULL,
  gf INT NOT NULL,
  ga INT NOT NULL,
  gd INT NOT NULL,
  points INT NOT NULL,
  rank INT NOT NULL,

  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (phase_id, pool_id, team_id)
);

-- =========================
-- Helpful indexes
-- =========================
CREATE INDEX idx_division_tournament ON division(tournament_id);
CREATE INDEX idx_team_division ON team(division_id);
CREATE INDEX idx_phase_division ON phase(division_id);
CREATE INDEX idx_pool_phase ON pool(phase_id);
CREATE INDEX idx_game_division ON game(division_id);
CREATE INDEX idx_game_phase ON game(phase_id);
CREATE INDEX idx_game_pool ON game(pool_id);
