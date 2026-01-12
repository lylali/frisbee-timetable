package com.lyla.frisbee_timetable.phase;

public class CreatePhaseRequest {
  private String type; // optional
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  private String name;
  private Integer orderIndex;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getOrderIndex() { return orderIndex; }
  public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
