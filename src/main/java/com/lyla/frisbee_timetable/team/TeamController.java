package com.lyla.frisbee_timetable.team;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TeamController {

  private final TeamRepository repo;

  public TeamController(TeamRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/divisions/{divisionId}/teams")
  public List<Team> listByDivision(@PathVariable UUID divisionId) {
    return repo.findByDivisionIdOrderBySeedAscNameAsc(divisionId);
  }
}
