package com.lyla.frisbee_timetable.team;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lyla.frisbee_timetable.division.Division;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "team")
public class Team {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "division_id", nullable = false)
  @JsonIgnoreProperties({"tournament", "teams", "phases"})
  private Division division;

  @Column(nullable = false)
  private String name;

  private Integer seed;

  private String club;

  @Column(name = "bonus_points", nullable = false)
  private int bonusPoints = 0;

  @Column(name = "penalty_points", nullable = false)
  private int penaltyPoints = 0;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Division getDivision() { return division; }
  public void setDivision(Division division) { this.division = division; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getSeed() { return seed; }
  public void setSeed(Integer seed) { this.seed = seed; }

  public String getClub() { return club; }
  public void setClub(String club) { this.club = club; }

  public int getBonusPoints() { return bonusPoints; }
  public void setBonusPoints(int bonusPoints) { this.bonusPoints = bonusPoints; }

  public int getPenaltyPoints() { return penaltyPoints; }
  public void setPenaltyPoints(int penaltyPoints) { this.penaltyPoints = penaltyPoints; }
}
