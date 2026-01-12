package com.lyla.frisbee_timetable.phase;

import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.tournament.Tournament;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "phase")
public class Phase {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = true)
  @JoinColumn(name = "division_id", nullable = true)
  @JsonIgnoreProperties({"tournament", "teams", "phases"})
  private Division division;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @Column(nullable = false)
  private String name;

  @Column(name = "order_index", nullable = false)
  private int orderIndex;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt = Instant.now();

  @Column(name = "type", nullable = false)
  private String type = "POOL_PLAY"; 
  
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  @PreUpdate
  void touch() {
    this.updatedAt = Instant.now();
  }

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Division getDivision() { return division; }
  public void setDivision(Division division) { this.division = division; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getOrderIndex() { return orderIndex; }
  public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Tournament getTournament() { return tournament; }
  public void setTournament(Tournament tournament) { this.tournament = tournament; }
}
