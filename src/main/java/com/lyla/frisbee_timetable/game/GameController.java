package com.lyla.frisbee_timetable.game;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.division.DivisionRepository;
import com.lyla.frisbee_timetable.field.Field;
import com.lyla.frisbee_timetable.field.FieldRepository;
import com.lyla.frisbee_timetable.phase.Phase;
import com.lyla.frisbee_timetable.phase.PhaseRepository;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.team.TeamRepository;
import com.lyla.frisbee_timetable.timeslot.Timeslot;
import com.lyla.frisbee_timetable.timeslot.TimeslotRepository;

@RestController
@RequestMapping("/api")
public class GameController {

  private final GameRepository repo;
  private final DivisionRepository divisionRepo;
  private final TimeslotRepository timeslotRepo;
  private final FieldRepository fieldRepo;
  private final TeamRepository teamRepo;
  private final PhaseRepository phaseRepo;

  public GameController(
      GameRepository repo,
      DivisionRepository divisionRepo,
      TimeslotRepository timeslotRepo,
      FieldRepository fieldRepo,
      TeamRepository teamRepo,
      PhaseRepository phaseRepo
  ) {
    this.repo = repo;
    this.divisionRepo = divisionRepo;
    this.timeslotRepo = timeslotRepo;
    this.fieldRepo = fieldRepo;
    this.teamRepo = teamRepo;
    this.phaseRepo = phaseRepo;
  }

  @GetMapping("/divisions/{divisionId}/games")
  public List<Game> list(@PathVariable UUID divisionId) {
    return repo.findByDivisionIdOrderByTimeslotDayDateAscTimeslotStartTimeAscPitchNameAsc(divisionId);
  }

  @GetMapping("/phases/{phaseId}/games")
  public List<Game> listByPhase(@PathVariable UUID phaseId) {
    phaseRepo.findById(phaseId)
        .orElseThrow(() -> new IllegalArgumentException("Phase not found: " + phaseId));
    return repo.findByPhaseIdOrderByGameNumberAsc(phaseId);
  }

  @PatchMapping("/games/{gameId}")
  public Game updateGame(@PathVariable UUID gameId, @RequestBody UpdateGameRequest req) {
    Game g = repo.findById(gameId)
        .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));

    if (req.getTeam1Score() != null) g.setTeam1Score(req.getTeam1Score());
    if (req.getTeam2Score() != null) g.setTeam2Score(req.getTeam2Score());
    if (req.getStatus() != null && !req.getStatus().isBlank()) g.setStatus(req.getStatus().trim());
    if (req.getTimeslotId() != null) {
      Timeslot ts = timeslotRepo.findById(req.getTimeslotId())
          .orElseThrow(() -> new IllegalArgumentException("Timeslot not found: " + req.getTimeslotId()));
      g.setTimeslot(ts);
    }
    if (req.getFieldId() != null) {
      Field field = fieldRepo.findById(req.getFieldId())
          .orElseThrow(() -> new IllegalArgumentException("Field not found: " + req.getFieldId()));
      g.setPitch(field);
    }
    Game saved = repo.save(g);

    // When a bracket game is finalised, advance the winner into the next round.
    if ("FINAL".equals(saved.getStatus())
        && saved.getTeam1Score() != null
        && saved.getTeam2Score() != null
        && saved.getPhase() != null
        && saved.getGameNumber() != null) {

      if (saved.getTeam1Score().equals(saved.getTeam2Score())) {
        // Draws are invalid in elimination — skip advancement
        return saved;
      }

      Team winner = saved.getTeam1Score() > saved.getTeam2Score()
          ? saved.getTeam1()
          : saved.getTeam2();
      String sourceKey = "W" + saved.getGameNumber();
      UUID phaseId = saved.getPhase().getId();

      for (Game next : repo.findByPhaseIdAndTeam1Source(phaseId, sourceKey)) {
        next.setTeam1(winner);
        repo.save(next);
      }
      for (Game next : repo.findByPhaseIdAndTeam2Source(phaseId, sourceKey)) {
        next.setTeam2(winner);
        repo.save(next);
      }

      // Advance loser into any game that references L{gameNumber}
      Team loser = winner == saved.getTeam1() ? saved.getTeam2() : saved.getTeam1();
      String loserKey = "L" + saved.getGameNumber();
      for (Game next : repo.findByPhaseIdAndTeam1Source(phaseId, loserKey)) {
        next.setTeam1(loser);
        repo.save(next);
      }
      for (Game next : repo.findByPhaseIdAndTeam2Source(phaseId, loserKey)) {
        next.setTeam2(loser);
        repo.save(next);
      }
    }

    return saved;
  }

  @DeleteMapping("/phases/{phaseId}/games")
  @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
  public void deletePhaseGames(@PathVariable UUID phaseId) {
    phaseRepo.findById(phaseId)
        .orElseThrow(() -> new IllegalArgumentException("Phase not found: " + phaseId));
    List<Game> games = repo.findByPhaseIdOrderByGameNumberAsc(phaseId);
    repo.deleteAll(games);
  }

  @PostMapping("/divisions/{divisionId}/games")
  @ResponseStatus(HttpStatus.CREATED)
  public Game create(@PathVariable UUID divisionId, @RequestBody CreateGameRequest req) {
    Division division = divisionRepo.findById(divisionId)
        .orElseThrow(() -> new IllegalArgumentException("Division not found: " + divisionId));

    Timeslot timeslot = null;

    if (req.getPhaseId() == null) {
    throw new IllegalArgumentException("phaseId is required");
    }

    Phase phase = phaseRepo.findById(req.getPhaseId())
        .orElseThrow(() -> new IllegalArgumentException("Phase not found: " + req.getPhaseId()));

    Division phaseDiv = phase.getDivision();
    if (phaseDiv == null || !phaseDiv.getId().equals(division.getId())) {
      throw new IllegalArgumentException("Phase does not belong to this division");
    }

    if (req.getTimeslotId() != null) {
      timeslot = timeslotRepo.findById(req.getTimeslotId())
          .orElseThrow(() -> new IllegalArgumentException("Timeslot not found: " + req.getTimeslotId()));
    }

    Field pitch = null;
    if (req.getPitchId() != null) {
      pitch = fieldRepo.findById(req.getPitchId())
          .orElseThrow(() -> new IllegalArgumentException("Pitch not found: " + req.getPitchId()));
    }

    Team team1 = null;
    if (req.getTeam1Id() != null) {
      team1 = teamRepo.findById(req.getTeam1Id())
          .orElseThrow(() -> new IllegalArgumentException("Team1 not found: " + req.getTeam1Id()));
    }

    Team team2 = null;
    if (req.getTeam2Id() != null) {
      team2 = teamRepo.findById(req.getTeam2Id())
          .orElseThrow(() -> new IllegalArgumentException("Team2 not found: " + req.getTeam2Id()));
    }

    Game g = new Game();
    g.setDivision(division);
    g.setTimeslot(timeslot);
    g.setPitch(pitch);
    g.setTeam1(team1);
    g.setTeam2(team2);
    g.setGameNumber(req.getGameNumber());
    g.setRoundLabel(req.getRoundLabel());
    g.setStatus("SCHEDULED");
    g.setDivision(division);
    g.setPhase(phase);
    return repo.save(g);
  }
}
