package com.lyla.frisbee_timetable.division;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DivisionController {

  private final DivisionRepository repo;

  public DivisionController(DivisionRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/tournaments/{tournamentId}/divisions")
  public List<Division> listByTournament(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByOrderIndexAsc(tournamentId);
  }
}
