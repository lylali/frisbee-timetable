package com.lyla.frisbee_timetable.game;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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

  @PatchMapping("/api/games/{gameId}")
  public Game updateGame(@PathVariable UUID gameId, @RequestBody UpdateGameRequest req) {
    Game g = repo.findById(gameId)
        .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));

    if (req.getTeam1Score() != null) g.setTeam1Score(req.getTeam1Score());
    if (req.getTeam2Score() != null) g.setTeam2Score(req.getTeam2Score());
    if (req.getStatus() != null && !req.getStatus().isBlank()) g.setStatus(req.getStatus().trim());
    return repo.save(g);
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

    if (!phase.getDivision().getId().equals(division.getId())) {
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
