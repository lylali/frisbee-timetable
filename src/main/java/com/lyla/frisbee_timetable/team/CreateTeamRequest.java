package com.lyla.frisbee_timetable.team;

import jakarta.validation.constraints.NotBlank;

public class CreateTeamRequest {

  @NotBlank
  private String name;

  private Integer seed;
  private String club;
  private java.util.UUID leaderId;

  public java.util.UUID getLeaderId() { return leaderId; }
  public void setLeaderId(java.util.UUID leaderId) { this.leaderId = leaderId; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getSeed() { return seed; }
  public void setSeed(Integer seed) { this.seed = seed; }

  public String getClub() { return club; }
  public void setClub(String club) { this.club = club; }
}
