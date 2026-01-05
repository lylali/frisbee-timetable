package com.lyla.frisbee_timetable.timeslot;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TimeslotController {

  private final TimeslotRepository repo;

  public TimeslotController(TimeslotRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/tournaments/{tournamentId}/timeslots")
  public List<Timeslot> list(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByDayDateAscStartTimeAsc(tournamentId);
  }
}
