-- Team leader accounts
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link team to the leader who registered it
ALTER TABLE team ADD COLUMN leader_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Players/members on a team for a tournament
CREATE TABLE roster_entry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  player_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roster_team ON roster_entry(team_id);
CREATE INDEX idx_team_leader ON team(leader_id);
