CREATE TABLE game (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tournament_id UUID NOT NULL REFERENCES tournament(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES division(id) ON DELETE CASCADE,
  timeslot_id UUID NOT NULL REFERENCES timeslot(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES field(id) ON DELETE CASCADE,

  home_team_id UUID NOT NULL REFERENCES team(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES team(id) ON DELETE RESTRICT,

  home_score INT,
  away_score INT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_game_field_timeslot UNIQUE (field_id, timeslot_id)
);

CREATE INDEX idx_game_tournament_id ON game(tournament_id);
CREATE INDEX idx_game_division_id ON game(division_id);
CREATE INDEX idx_game_timeslot_id ON game(timeslot_id);
CREATE INDEX idx_game_field_id ON game(field_id);
CREATE INDEX idx_game_home_team_id ON game(home_team_id);
CREATE INDEX idx_game_away_team_id ON game(away_team_id);
