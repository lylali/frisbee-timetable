package com.lyla.frisbee_timetable.game;

import java.util.UUID;

public class UpdateGameRequest {
  private Integer team1Score;
  private Integer team2Score;
  private String status;
  private UUID timeslotId;
  private UUID fieldId;

  public Integer getTeam1Score() { return team1Score; }
  public void setTeam1Score(Integer team1Score) { this.team1Score = team1Score; }

  public Integer getTeam2Score() { return team2Score; }
  public void setTeam2Score(Integer team2Score) { this.team2Score = team2Score; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public UUID getTimeslotId() { return timeslotId; }
  public void setTimeslotId(UUID timeslotId) { this.timeslotId = timeslotId; }

  public UUID getFieldId() { return fieldId; }
  public void setFieldId(UUID fieldId) { this.fieldId = fieldId; }
}
