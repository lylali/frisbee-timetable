package com.lyla.frisbee_timetable.timeslot;

import java.time.LocalDate;
import java.time.LocalTime;
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
    name = "timeslot",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_timeslot_tournament_day_start_end",
        columnNames = {"tournament_id", "day_date", "start_time", "end_time"}
    )
)
public class Timeslot {

  @Id
  @GeneratedValue
  private UUID id;

  @JsonIgnore
  @ManyToOne(optional = false)
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @Column(name = "day_date", nullable = false)
  private LocalDate dayDate;

  @Column(name = "start_time", nullable = false)
  private LocalTime startTime;

  @Column(name = "end_time", nullable = false)
  private LocalTime endTime;

  private String label;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Tournament getTournament() { return tournament; }
  public void setTournament(Tournament tournament) { this.tournament = tournament; }

  public LocalDate getDayDate() { return dayDate; }
  public void setDayDate(LocalDate dayDate) { this.dayDate = dayDate; }

  public LocalTime getStartTime() { return startTime; }
  public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

  public LocalTime getEndTime() { return endTime; }
  public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

  public String getLabel() { return label; }
  public void setLabel(String label) { this.label = label; }
}
