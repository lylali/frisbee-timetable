package com.lyla.frisbee_timetable.field;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FieldController {

  private final FieldRepository repo;

  public FieldController(FieldRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/tournaments/{tournamentId}/fields")
  public List<Field> list(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByNameAsc(tournamentId);
  }
}
