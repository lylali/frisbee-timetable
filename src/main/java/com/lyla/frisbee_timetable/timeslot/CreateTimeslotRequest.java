package com.lyla.frisbee_timetable.timeslot;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public class CreateTimeslotRequest {

  @NotNull
  private LocalDate dayDate;

  @NotNull
  private LocalTime startTime;

  @NotNull
  private LocalTime endTime;

  private String label;

  public LocalDate getDayDate() { return dayDate; }
  public void setDayDate(LocalDate dayDate) { this.dayDate = dayDate; }

  public LocalTime getStartTime() { return startTime; }
  public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

  public LocalTime getEndTime() { return endTime; }
  public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

  public String getLabel() { return label; }
  public void setLabel(String label) { this.label = label; }
}
