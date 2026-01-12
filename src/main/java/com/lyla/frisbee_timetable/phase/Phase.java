package com.lyla.frisbee_timetable.phase;

import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lyla.frisbee_timetable.division.Division;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Phase represents a scheduling stage within a division (e.g., Pool Play, Bracket).
 * Games belong to a Phase via game.phase_id.
 */
@Entity
@Table(name = "phase")
public class Phase {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "division_id", nullable = false)
  private Division division;

  @Column(nullable = false)
  private String name;

  @Column(name = "order_index", nullable = false)
  private int orderIndex;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt = Instant.now();

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
}
