package com.lyla.frisbee_timetable.phase;

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

@RestController
@RequestMapping("/api")
public class PhaseController {

  private final PhaseRepository phaseRepo;
  private final TournamentRepository tournamentRepo;

  public PhaseController(PhaseRepository phaseRepo, TournamentRepository tournamentRepo) {
    this.phaseRepo = phaseRepo;
    this.tournamentRepo = tournamentRepo;
  }

  @GetMapping("/tournaments/{tournamentId}/phases")
  public List<Phase> list(@PathVariable UUID tournamentId) {
    return phaseRepo.findByTournamentIdOrderByOrderIndexAsc(tournamentId);
  }

  @PostMapping("/tournaments/{tournamentId}/phases")
  @ResponseStatus(HttpStatus.CREATED)
  public Phase create(@PathVariable UUID tournamentId, @RequestBody CreatePhaseRequest req) {
    
    // Fail fast with a useful 404 if tournament doesn't exist.
    Tournament tournament = tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new PhaseNotFoundException("Tournament not found: " + tournamentId));

    Phase phase = new Phase();
    phase.setTournament(tournament);

    phase.setName(req.getName());
    phase.setOrderIndex(req.getOrderIndex() == null ? 1 : req.getOrderIndex());

    String type = (req.getType() == null || req.getType().isBlank())
    ? "POOL_PLAY"
    : req.getType().trim();
    phase.setType(type);
    
    return phaseRepo.save(phase);
  }

  /**
   * Simple 404 mapping without adding a whole global exception handler yet.
   */
  @ResponseStatus(HttpStatus.NOT_FOUND)
  private static class PhaseNotFoundException extends RuntimeException {
    PhaseNotFoundException(String msg) { super(msg); }
  }
}
