package com.lyla.frisbee_timetable.division;

import java.util.UUID;

import com.lyla.frisbee_timetable.tournament.Tournament;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "division")
public class Division {

  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @Column(nullable = false)
  private String name;

  @Column(name = "order_index", nullable = false)
  private int orderIndex = 0;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Tournament getTournament() { return tournament; }
  public void setTournament(Tournament tournament) { this.tournament = tournament; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getOrderIndex() { return orderIndex; }
  public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
