package com.lyla.frisbee_timetable.game;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.field.Field;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.timeslot.Timeslot;
import com.lyla.frisbee_timetable.tournament.Tournament;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "game",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_game_field_timeslot",
        columnNames = {"field_id", "timeslot_id"}
    )
)
public class Game {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @ManyToOne(optional = false)
  @JoinColumn(name = "division_id", nullable = false)
  private Division division;

  @ManyToOne(optional = false)
  @JoinColumn(name = "timeslot_id", nullable = false)
  private Timeslot timeslot;

  @ManyToOne(optional = false)
  @JoinColumn(name = "field_id", nullable = false)
  private Field field;

  @ManyToOne(optional = false)
  @JoinColumn(name = "home_team_id", nullable = false)
  private Team homeTeam;

  @ManyToOne(optional = false)
  @JoinColumn(name = "away_team_id", nullable = false)
  private Team awayTeam;

  private Integer homeScore;
  private Integer awayScore;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Tournament getTournament() { return tournament; }
  public void setTournament(Tournament tournament) { this.tournament = tournament; }

  public Division getDivision() { return division; }
  public void setDivision(Division division) { this.division = division; }

  public Timeslot getTimeslot() { return timeslot; }
  public void setTimeslot(Timeslot timeslot) { this.timeslot = timeslot; }

  public Field getField() { return field; }
  public void setField(Field field) { this.field = field; }

  public Team getHomeTeam() { return homeTeam; }
  public void setHomeTeam(Team homeTeam) { this.homeTeam = homeTeam; }

  public Team getAwayTeam() { return awayTeam; }
  public void setAwayTeam(Team awayTeam) { this.awayTeam = awayTeam; }

  public Integer getHomeScore() { return homeScore; }
  public void setHomeScore(Integer homeScore) { this.homeScore = homeScore; }

  public Integer getAwayScore() { return awayScore; }
  public void setAwayScore(Integer awayScore) { this.awayScore = awayScore; }
}
