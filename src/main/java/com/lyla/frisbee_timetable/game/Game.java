package com.lyla.frisbee_timetable.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.field.Field;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.timeslot.Timeslot;
import jakarta.persistence.*;
import java.util.UUID;

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

  /**
   * Your DB has phase_id (NOT NULL) but you don't have a Phase entity yet.
   * Map it as a UUID for now to satisfy schema validation.
   */
  @Column(name = "phase_id", nullable = false)
  private UUID phaseId;

  /**
   * pool_id exists and is nullable. Map as UUID for now.
   */
  @Column(name = "pool_id")
  private UUID poolId;

  @Column(name = "round_label")
  private String roundLabel;

  @Column(name = "game_number")
  private Integer gameNumber;

  @ManyToOne
  @JoinColumn(name = "timeslot_id")
  private Timeslot timeslot;

  /**
   * Your DB column is pitch_id (NOT field_id).
   * We map it to your existing Field entity but join via pitch_id.
   */
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

  @Column(name = "status", nullable = false)
  private String status;

  // --- getters/setters ---

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Division getDivision() { return division; }
  public void setDivision(Division division) { this.division = division; }

  public UUID getPhaseId() { return phaseId; }
  public void setPhaseId(UUID phaseId) { this.phaseId = phaseId; }

  public UUID getPoolId() { return poolId; }
  public void setPoolId(UUID poolId) { this.poolId = poolId; }

  public String getRoundLabel() { return roundLabel; }
  public void setRoundLabel(String roundLabel) { this.roundLabel = roundLabel; }

  public Integer getGameNumber() { return gameNumber; }
  public void setGameNumber(Integer gameNumber) { this.gameNumber = gameNumber; }

  public Timeslot getTimeslot() { return timeslot; }
  public void setTimeslot(Timeslot timeslot) { this.timeslot = timeslot; }

  public Field getPitch() { return pitch; }
  public void setPitch(Field pitch) { this.pitch = pitch; }

  public Team getTeam1() { return team1; }
  public void setTeam1(Team team1) { this.team1 = team1; }

  public Team getTeam2() { return team2; }
  public void setTeam2(Team team2) { this.team2 = team2; }

  public String getTeam1Source() { return team1Source; }
  public void setTeam1Source(String team1Source) { this.team1Source = team1Source; }

  public String getTeam2Source() { return team2Source; }
  public void setTeam2Source(String team2Source) { this.team2Source = team2Source; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
