package com.lyla.frisbee_timetable.tournament;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
