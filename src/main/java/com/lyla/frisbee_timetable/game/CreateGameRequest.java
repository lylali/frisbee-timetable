package com.lyla.frisbee_timetable.game;

import java.util.UUID;

public class CreateGameRequest {
  private UUID timeslotId;
  private UUID pitchId;
  private UUID team1Id;
  private UUID team2Id;
  private Integer gameNumber;
  private String roundLabel;

  public UUID getTimeslotId() { return timeslotId; }
  public void setTimeslotId(UUID timeslotId) { this.timeslotId = timeslotId; }

  public UUID getPitchId() { return pitchId; }
  public void setPitchId(UUID pitchId) { this.pitchId = pitchId; }

  public UUID getTeam1Id() { return team1Id; }
  public void setTeam1Id(UUID team1Id) { this.team1Id = team1Id; }

  public UUID getTeam2Id() { return team2Id; }
  public void setTeam2Id(UUID team2Id) { this.team2Id = team2Id; }

  public Integer getGameNumber() { return gameNumber; }
  public void setGameNumber(Integer gameNumber) { this.gameNumber = gameNumber; }

  public String getRoundLabel() { return roundLabel; }
  public void setRoundLabel(String roundLabel) { this.roundLabel = roundLabel; }
}
