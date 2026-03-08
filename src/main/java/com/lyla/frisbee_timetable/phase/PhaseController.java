package com.lyla.frisbee_timetable.phase;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.division.DivisionRepository;
import com.lyla.frisbee_timetable.game.Game;
import com.lyla.frisbee_timetable.game.GameRepository;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.team.TeamRepository;
import com.lyla.frisbee_timetable.tournament.Tournament;
import com.lyla.frisbee_timetable.tournament.TournamentRepository;

@RestController
@RequestMapping("/api")
public class PhaseController {

  private final PhaseRepository phaseRepo;
  private final DivisionRepository divisionRepo;
  private final TournamentRepository tournamentRepo;
  private final GameRepository gameRepo;
  private final TeamRepository teamRepo;

  public PhaseController(
      PhaseRepository phaseRepo,
      DivisionRepository divisionRepo,
      TournamentRepository tournamentRepo,
      GameRepository gameRepo,
      TeamRepository teamRepo
  ) {
    this.phaseRepo = phaseRepo;
    this.divisionRepo = divisionRepo;
    this.tournamentRepo = tournamentRepo;
    this.gameRepo = gameRepo;
    this.teamRepo = teamRepo;
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

  @GetMapping("/phases/{phaseId}/standings")
  public List<StandingRow> standings(@PathVariable UUID phaseId) {
    phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));

    List<Game> games = gameRepo.findByPhaseIdOrderByGameNumberAsc(phaseId);

    Map<UUID, StandingRow> table = new LinkedHashMap<>();
    for (Game g : games) {
      if (g.getTeam1Score() == null || g.getTeam2Score() == null) continue;
      if (g.getTeam1() == null || g.getTeam2() == null) continue;

      StandingRow r1 = table.computeIfAbsent(g.getTeam1().getId(), id -> new StandingRow(g.getTeam1()));
      StandingRow r2 = table.computeIfAbsent(g.getTeam2().getId(), id -> new StandingRow(g.getTeam2()));

      int s1 = g.getTeam1Score(), s2 = g.getTeam2Score();
      r1.pf += s1; r1.pa += s2; r1.gp++;
      r2.pf += s2; r2.pa += s1; r2.gp++;

      if      (s1 > s2) { r1.w++; r2.l++; }
      else if (s2 > s1) { r2.w++; r1.l++; }
      else              { r1.d++; r2.d++; }
    }

    List<StandingRow> rows = new ArrayList<>(table.values());
    rows.sort(Comparator
        .<StandingRow>comparingInt(r -> -r.w)
        .thenComparingInt(r -> -(r.pf - r.pa))
        .thenComparingInt(r -> -r.pf));
    for (int i = 0; i < rows.size(); i++) rows.get(i).rank = i + 1;

    return rows;
  }

  public static class StandingRow {
    public int rank;
    public Team team;
    public int gp, w, l, d, pf, pa;

    StandingRow(Team team) { this.team = team; }

    public int getPd() { return pf - pa; }
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
  // BRACKET GENERATION
  // ----------------------------

  /**
   * Generate a single-elimination bracket for a BRACKET phase.
   * Accepts seeded team IDs in order (index 0 = seed 1, highest seed).
   * Team count must be a power of 2 (2, 4, 8, 16).
   *
   * Round 1 games get real teams assigned.
   * Later-round games get team1Source/team2Source = "W{gameNumber}" (winner of that game).
   *
   * Example for 4 teams:
   *   Game 1: Seed 1 vs Seed 4  (SF)
   *   Game 2: Seed 2 vs Seed 3  (SF)
   *   Game 3: W1 vs W2          (Final)
   */
  @PostMapping("/phases/{phaseId}/bracket/generate")
  @ResponseStatus(HttpStatus.CREATED)
  public List<Game> generateBracket(@PathVariable UUID phaseId, @RequestBody BracketGenerateRequest req) {
    Phase phase = phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));

    if (phase.getType() != PhaseType.BRACKET) {
      throw new BadRequestException("Phase type must be BRACKET, got: " + phase.getType());
    }
    Division division = phase.getDivision();
    if (division == null) {
      throw new BadRequestException("Bracket generation requires a division-scoped phase");
    }

    List<UUID> teamIds = req.getTeamIds();
    if (teamIds == null || teamIds.size() < 2) {
      throw new BadRequestException("At least 2 team IDs required");
    }
    int n = teamIds.size();
    if ((n & (n - 1)) != 0) {
      throw new BadRequestException("Team count must be a power of 2 (2, 4, 8, 16)");
    }

    List<Team> seeds = new ArrayList<>();
    for (UUID id : teamIds) {
      seeds.add(teamRepo.findById(id)
          .orElseThrow(() -> new NotFoundException("Team not found: " + id)));
    }

    // Build bracket positions using standard seeding recursion:
    // bracket(2) = [1, 2]
    // bracket(n) = interleave each seed with its complement: [s, n+1-s, ...]
    List<Integer> positions = bracketPositions(n);

    List<Game> created = new ArrayList<>();
    // Use a simple counter starting at max existing game number + 1 for this phase
    int[] gameNum = { gameRepo.findByPhaseIdOrderByGameNumberAsc(phaseId)
        .stream().mapToInt(g -> g.getGameNumber() == null ? 0 : g.getGameNumber())
        .max().orElse(0) + 1 };

    // Round 1: n/2 games with real teams
    List<Integer> prevGameNums = new ArrayList<>();
    String round1Label = roundLabel(n, n / 2);
    for (int i = 0; i < positions.size(); i += 2) {
      int seed1 = positions.get(i);
      int seed2 = positions.get(i + 1);
      Game g = new Game();
      g.setDivision(division);
      g.setPhase(phase);
      g.setTeam1(seeds.get(seed1 - 1));
      g.setTeam2(seeds.get(seed2 - 1));
      g.setTeam1Source("Seed " + seed1);
      g.setTeam2Source("Seed " + seed2);
      g.setGameNumber(gameNum[0]);
      g.setRoundLabel(round1Label);
      g.setStatus("SCHEDULED");
      created.add(gameRepo.save(g));
      prevGameNums.add(gameNum[0]++);
    }

    // Subsequent rounds: pair winners of previous round
    int teamsRemaining = n / 2;
    while (teamsRemaining > 1) {
      teamsRemaining /= 2;
      String label = roundLabel(n, teamsRemaining);
      List<Integer> thisRoundGameNums = new ArrayList<>();
      for (int i = 0; i < prevGameNums.size(); i += 2) {
        Game g = new Game();
        g.setDivision(division);
        g.setPhase(phase);
        g.setTeam1Source("W" + prevGameNums.get(i));
        g.setTeam2Source("W" + prevGameNums.get(i + 1));
        g.setGameNumber(gameNum[0]);
        g.setRoundLabel(label);
        g.setStatus("SCHEDULED");
        created.add(gameRepo.save(g));
        thisRoundGameNums.add(gameNum[0]++);
      }
      prevGameNums = thisRoundGameNums;
    }

    return created;
  }

  /** Recursively builds the bracket seeding order. bracket(2)=[1,2]; bracket(n) interleaves seeds with complements. */
  private static List<Integer> bracketPositions(int n) {
    if (n == 2) {
      List<Integer> r = new ArrayList<>();
      r.add(1); r.add(2);
      return r;
    }
    List<Integer> prev = bracketPositions(n / 2);
    List<Integer> result = new ArrayList<>();
    for (int s : prev) {
      result.add(s);
      result.add(n + 1 - s);
    }
    return result;
  }

  /** Returns a human-readable round label based on bracket size and teams remaining in this round. */
  private static String roundLabel(int bracketSize, int teamsInRound) {
    if (teamsInRound == 1) return "Final";
    if (teamsInRound == 2) return "Semifinal";
    if (teamsInRound == 4) return "Quarterfinal";
    return "Round of " + (teamsInRound * 2);
  }

  // ----------------------------
  // DTO + Exceptions
  // ----------------------------

  public static class BracketGenerateRequest {
    private List<UUID> teamIds;
    public List<UUID> getTeamIds() { return teamIds; }
    public void setTeamIds(List<UUID> teamIds) { this.teamIds = teamIds; }
  }

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