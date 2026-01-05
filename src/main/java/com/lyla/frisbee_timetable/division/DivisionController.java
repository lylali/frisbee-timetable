package com.lyla.frisbee_timetable.division;

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
public class DivisionController {

  private final DivisionRepository repo;
  private final TournamentRepository tournamentRepo;

  public DivisionController(DivisionRepository repo, TournamentRepository tournamentRepo) {
    this.repo = repo;
    this.tournamentRepo = tournamentRepo;
  }

  @GetMapping("/tournaments/{tournamentId}/divisions")
  public List<Division> listByTournament(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByOrderIndexAsc(tournamentId);
  }

  @PostMapping("/tournaments/{tournamentId}/divisions")
  @ResponseStatus(HttpStatus.CREATED)
  public Division create(
      @PathVariable UUID tournamentId,
      @Valid @RequestBody CreateDivisionRequest req
  ) {
    Tournament t = tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

    Division d = new Division();
    d.setTournament(t);
    d.setName(req.getName());
    if (req.getOrderIndex() != null) d.setOrderIndex(req.getOrderIndex());
    return repo.save(d);
  }
}
