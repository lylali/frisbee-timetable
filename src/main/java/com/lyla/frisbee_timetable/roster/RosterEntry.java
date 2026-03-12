package com.lyla.frisbee_timetable.roster;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.lyla.frisbee_timetable.team.Team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "roster_entry")
public class RosterEntry {

  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @Column(name = "player_name", nullable = false)
  private String playerName;

  @Column(name = "player_email")
  private String playerEmail;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  void onCreate() { this.createdAt = OffsetDateTime.now(); }

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Team getTeam() { return team; }
  public void setTeam(Team team) { this.team = team; }

  public String getPlayerName() { return playerName; }
  public void setPlayerName(String playerName) { this.playerName = playerName; }

  public String getPlayerEmail() { return playerEmail; }
  public void setPlayerEmail(String playerEmail) { this.playerEmail = playerEmail; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
