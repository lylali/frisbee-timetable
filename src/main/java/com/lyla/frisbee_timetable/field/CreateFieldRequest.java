package com.lyla.frisbee_timetable.field;

import jakarta.validation.constraints.NotBlank;

public class CreateFieldRequest {

  @NotBlank
  private String name;

  private String locationNote;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getLocationNote() { return locationNote; }
  public void setLocationNote(String locationNote) { this.locationNote = locationNote; }
}
