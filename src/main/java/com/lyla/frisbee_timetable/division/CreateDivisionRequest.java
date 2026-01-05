package com.lyla.frisbee_timetable.division;

import jakarta.validation.constraints.NotBlank;

public class CreateDivisionRequest {

  @NotBlank
  private String name;

  private Integer orderIndex;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getOrderIndex() { return orderIndex; }
  public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
