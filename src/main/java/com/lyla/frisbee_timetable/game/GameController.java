package com.lyla.frisbee_timetable.game;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GameController {

  private final GameRepository repo;

  public GameController(GameRepository repo) {
    this.repo = repo;
  }

  @GetMapping("/divisions/{divisionId}/games")
  public List<Game> list(@PathVariable UUID divisionId) {
    return repo.findByDivisionIdOrderByGameNumberAsc(divisionId);
  }
}
