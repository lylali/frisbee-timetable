package com.lyla.frisbee_timetable.game;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.field.Field;
import com.lyla.frisbee_timetable.phase.Phase;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.timeslot.Timeslot;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "game")
public class Game {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "division_id", nullable = false)
  private Division division;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "phase_id", nullable = false)
  private Phase phase;

  @Column(name = "pool_id")
  private UUID poolId;

  @Column(name = "round_label")
  private String roundLabel;

  @Column(name = "game_number")
  private Integer gameNumber;

  @ManyToOne
  @JoinColumn(name = "timeslot_id")
  private Timeslot timeslot;

  @ManyToOne
  @JoinColumn(name = "pitch_id")
  private Field pitch;

  @ManyToOne
  @JoinColumn(name = "team1_id")
  private Team team1;

  @ManyToOne
  @JoinColumn(name = "team2_id")
  private Team team2;

  @Column(name = "team1_source")
  private String team1Source;

  @Column(name = "team2_source")
  private String team2Source;

  @Column(name = "team1_score")
  private Integer team1Score;

  @Column(name = "team2_score")
  private Integer team2Score;

  @Column(name = "status", nullable = false)
  private String status;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Division getDivision() {
    return division;
  }

  public void setDivision(Division division) {
    this.division = division;
  }

  public Phase getPhase() {
    return phase;
  }

  public void setPhase(Phase phase) {
    this.phase = phase;
  }

  public UUID getPoolId() {
    return poolId;
  }

  public void setPoolId(UUID poolId) {
    this.poolId = poolId;
  }

  public String getRoundLabel() {
    return roundLabel;
  }

  public void setRoundLabel(String roundLabel) {
    this.roundLabel = roundLabel;
  }

  public Integer getGameNumber() {
    return gameNumber;
  }

  public void setGameNumber(Integer gameNumber) {
    this.gameNumber = gameNumber;
  }

  public Timeslot getTimeslot() {
    return timeslot;
  }

  public void setTimeslot(Timeslot timeslot) {
    this.timeslot = timeslot;
  }

  public Field getPitch() {
    return pitch;
  }

  public void setPitch(Field pitch) {
    this.pitch = pitch;
  }

  public Team getTeam1() {
    return team1;
  }

  public void setTeam1(Team team1) {
    this.team1 = team1;
  }

  public Team getTeam2() {
    return team2;
  }

  public void setTeam2(Team team2) {
    this.team2 = team2;
  }

  public String getTeam1Source() {
    return team1Source;
  }

  public void setTeam1Source(String team1Source) {
    this.team1Source = team1Source;
  }

  public String getTeam2Source() {
    return team2Source;
  }

  public void setTeam2Source(String team2Source) {
    this.team2Source = team2Source;
  }

  public Integer getTeam1Score() {
    return team1Score;
  }

  public void setTeam1Score(Integer team1Score) {
    this.team1Score = team1Score;
  }

  public Integer getTeam2Score() {
    return team2Score;
  }

  public void setTeam2Score(Integer team2Score) {
    this.team2Score = team2Score;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
