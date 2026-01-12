package com.lyla.frisbee_timetable.phase;

/** Minimal payload for creating a phase. */
public class CreatePhaseRequest {
  private String name;
  private int orderIndex;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getOrderIndex() { return orderIndex; }
  public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
