package com.lyla.frisbee_timetable.tournament;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateTournamentRequest {

  @NotBlank
  private String name;

  private Integer seasonYear;

  private LocalDate startDate;
  private LocalDate endDate;

  @NotBlank
  private String timezone;

  @NotNull
  private TournamentStatus status;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getSeasonYear() { return seasonYear; }
  public void setSeasonYear(Integer seasonYear) { this.seasonYear = seasonYear; }

  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

  public String getTimezone() { return timezone; }
  public void setTimezone(String timezone) { this.timezone = timezone; }

  public TournamentStatus getStatus() { return status; }
  public void setStatus(TournamentStatus status) { this.status = status; }
}
