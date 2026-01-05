package com.lyla.frisbee_timetable.tournament;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TournamentController {

  private final TournamentRepository repo;

  public TournamentController(TournamentRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/tournaments")
  public List<Tournament> list() {
    return repo.findAll();
  }

  @PostMapping("/tournaments")
  @ResponseStatus(HttpStatus.CREATED)
  public Tournament create(@Valid @RequestBody CreateTournamentRequest req) {
    Tournament t = new Tournament();
    t.setName(req.getName());
    t.setSeasonYear(req.getSeasonYear());
    t.setStartDate(req.getStartDate());
    t.setEndDate(req.getEndDate());
    t.setTimezone(req.getTimezone());
    t.setStatus(req.getStatus());
    return repo.save(t);
  }

}
