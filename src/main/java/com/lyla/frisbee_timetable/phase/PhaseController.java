package com.lyla.frisbee_timetable.phase;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.division.DivisionRepository;
import com.lyla.frisbee_timetable.tournament.Tournament;
import com.lyla.frisbee_timetable.tournament.TournamentRepository;

@RestController
@RequestMapping("/api")
public class PhaseController {

  private final PhaseRepository phaseRepo;
  private final DivisionRepository divisionRepo;
  private final TournamentRepository tournamentRepo;

  public PhaseController(
      PhaseRepository phaseRepo,
      DivisionRepository divisionRepo,
      TournamentRepository tournamentRepo
  ) {
    this.phaseRepo = phaseRepo;
    this.divisionRepo = divisionRepo;
    this.tournamentRepo = tournamentRepo;
  }

  // ----------------------------
  // READ
  // ----------------------------

  @GetMapping("/divisions/{divisionId}/phases")
  public List<Phase> listByDivision(@PathVariable UUID divisionId) {
    // If division doesn't exist, return 404 instead of silently returning empty.
    divisionRepo.findById(divisionId)
        .orElseThrow(() -> new NotFoundException("Division not found: " + divisionId));

    return phaseRepo.findByDivisionIdOrderByOrderIndexAsc(divisionId);
  }

  @GetMapping("/tournaments/{tournamentId}/phases")
  public List<Phase> listByTournament(@PathVariable UUID tournamentId) {
    tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new NotFoundException("Tournament not found: " + tournamentId));

    return phaseRepo.findByTournamentIdOrderByOrderIndexAsc(tournamentId);
  }

  // ----------------------------
  // CREATE
  // ----------------------------

  /**
   * Create a phase under a Division.
   * In this case, the tournament is derived from the division.
   */
  @PostMapping("/divisions/{divisionId}/phases")
  @ResponseStatus(HttpStatus.CREATED)
  public Phase createUnderDivision(@PathVariable UUID divisionId, @RequestBody CreatePhaseRequest body) {
    Division division = divisionRepo.findById(divisionId)
        .orElseThrow(() -> new NotFoundException("Division not found: " + divisionId));

    Tournament tournament = division.getTournament();
    if (tournament == null) {
      // Defensive: division should always have a tournament in a sane schema.
      throw new IllegalStateException("Division has no tournament associated: " + divisionId);
    }

    validateCreateBody(body);

    Phase phase = new Phase();
    phase.setName(body.getName().trim());
    phase.setOrderIndex(body.getOrderIndex());
    phase.setType(body.getType() == null ? PhaseType.POOL_PLAY : body.getType());
    phase.setDivision(division);
    phase.setTournament(tournament);

    return phaseRepo.save(phase);
  }

  /**
   * Create a phase under a Tournament (not tied to a specific division).
   * Useful for tournament-wide phases.
   */
  @PostMapping("/tournaments/{tournamentId}/phases")
  @ResponseStatus(HttpStatus.CREATED)
  public Phase createUnderTournament(@PathVariable UUID tournamentId, @RequestBody CreatePhaseRequest body) {
    Tournament tournament = tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new NotFoundException("Tournament not found: " + tournamentId));

    validateCreateBody(body);

    Phase phase = new Phase();
    phase.setName(body.getName().trim());
    phase.setOrderIndex(body.getOrderIndex());
    phase.setType(body.getType() == null ? PhaseType.POOL_PLAY : body.getType());
    phase.setTournament(tournament);
    // division is intentionally left null

    return phaseRepo.save(phase);
  }

  private static void validateCreateBody(CreatePhaseRequest body) {
    if (body == null) throw new BadRequestException("Request body is required.");

    if (body.getName() == null || body.getName().trim().isEmpty()) {
      throw new BadRequestException("Field 'name' is required.");
    }
    if (body.getOrderIndex() == null) {
      throw new BadRequestException("Field 'orderIndex' is required.");
    }
  }

  // ----------------------------
  // DTO + Exceptions
  // ----------------------------

  public static class CreatePhaseRequest {
    private String name;
    private Integer orderIndex;
    private PhaseType type; 

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public PhaseType getType() { return type; }
    public void setType(PhaseType type) { this.type = type; }
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  private static class NotFoundException extends RuntimeException {
    NotFoundException(String message) { super(message); }
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  private static class BadRequestException extends RuntimeException {
    BadRequestException(String message) { super(message); }
  }
}