package com.lyla.frisbee_timetable.field;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lyla.frisbee_timetable.tournament.Tournament;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "field",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_field_tournament_name",
        columnNames = {"tournament_id", "name"}
    )
)
public class Field {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @Column(nullable = false)
  private String name;

  private String locationNote;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Tournament getTournament() { return tournament; }
  public void setTournament(Tournament tournament) { this.tournament = tournament; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getLocationNote() { return locationNote; }
  public void setLocationNote(String locationNote) { this.locationNote = locationNote; }
}
