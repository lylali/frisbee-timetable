package com.lyla.frisbee_timetable.timeslot;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.lyla.frisbee_timetable.tournament.Tournament;
import com.lyla.frisbee_timetable.tournament.TournamentRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TimeslotController {

  private final TimeslotRepository repo;
  private final TournamentRepository tournamentRepo;

  public TimeslotController(TimeslotRepository repo, TournamentRepository tournamentRepo) {
    this.repo = repo;
    this.tournamentRepo = tournamentRepo;
  }

  @GetMapping("/tournaments/{tournamentId}/timeslots")
  public List<Timeslot> list(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByDayDateAscStartTimeAsc(tournamentId);
  }

  @PostMapping("/tournaments/{tournamentId}/timeslots")
  @ResponseStatus(HttpStatus.CREATED)
  public Timeslot create(
      @PathVariable UUID tournamentId,
      @Valid @RequestBody CreateTimeslotRequest req
  ) {
    Tournament t = tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

    Timeslot ts = new Timeslot();
    ts.setTournament(t);
    ts.setDayDate(req.getDayDate());
    ts.setStartTime(req.getStartTime());
    ts.setEndTime(req.getEndTime());
    ts.setLabel(req.getLabel());
    return repo.save(ts);
  }
}
