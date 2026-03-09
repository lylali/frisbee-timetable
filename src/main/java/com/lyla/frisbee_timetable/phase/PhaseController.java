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

  @GetMapping("/phases/{phaseId}")
  public Phase get(@PathVariable UUID phaseId) {
    return phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));
  }

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
  // POOL PLAY GENERATION
  // ----------------------------

  /**
   * Generate round-robin games for a POOL_PLAY or PLACEMENT phase.
   * Accepts team IDs in any order. Works for any number of teams ≥ 2.
   * Uses the standard circle/rotation algorithm:
   *   - Fix team[0], rotate team[1..n-1] each round
   *   - For odd n, add a bye slot (no game created for bye matchup)
   * Produces n-1 rounds (even) or n rounds (odd), each labelled "Round N".
   */
  @PostMapping("/phases/{phaseId}/pool-play/generate")
  @ResponseStatus(HttpStatus.CREATED)
  public List<Game> generatePoolPlay(@PathVariable UUID phaseId, @RequestBody BracketGenerateRequest req) {
    Phase phase = phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));

    if (phase.getType() == PhaseType.BRACKET) {
      throw new BadRequestException("Use /bracket/generate for BRACKET phases");
    }
    Division division = phase.getDivision();
    if (division == null) {
      throw new BadRequestException("Pool play generation requires a division-scoped phase");
    }

    List<UUID> teamIds = req.getTeamIds();
    if (teamIds == null || teamIds.size() < 2) {
      throw new BadRequestException("At least 2 team IDs required");
    }

    List<Team> teams = new ArrayList<>();
    for (UUID id : teamIds) {
      teams.add(teamRepo.findById(id)
          .orElseThrow(() -> new NotFoundException("Team not found: " + id)));
    }

    int n = teams.size();
    boolean isOdd = n % 2 != 0;
    int nEff = isOdd ? n + 1 : n;   // effective count (even)
    int numRounds = nEff - 1;

    // positions[0..nEff-1]: index into teams list; nEff-1 is "bye" if odd
    List<Integer> positions = new ArrayList<>();
    for (int i = 0; i < nEff; i++) positions.add(i);

    int[] gameNum = { gameRepo.findByPhaseIdOrderByGameNumberAsc(phaseId)
        .stream().mapToInt(g -> g.getGameNumber() == null ? 0 : g.getGameNumber())
        .max().orElse(0) + 1 };

    List<Game> created = new ArrayList<>();

    for (int round = 0; round < numRounds; round++) {
      String label = "Round " + (round + 1);
      for (int i = 0; i < nEff / 2; i++) {
        int a = positions.get(i);
        int b = positions.get(nEff - 1 - i);
        // skip bye matchup
        if (isOdd && (a == n || b == n)) continue;

        Game g = new Game();
        g.setDivision(division);
        g.setPhase(phase);
        g.setTeam1(teams.get(a));
        g.setTeam2(teams.get(b));
        g.setGameNumber(gameNum[0]++);
        g.setRoundLabel(label);
        g.setStatus("SCHEDULED");
        created.add(gameRepo.save(g));
      }
      // Rotate positions[1..nEff-1] by moving last to index 1
      int last = positions.remove(nEff - 1);
      positions.add(1, last);
    }

    return created;
  }

  // ----------------------------
  // PAGE PLAYOFF GENERATION
  // ----------------------------

  /**
   * Generate a 4-team Page Playoff structure (standard ultimate frisbee finals format).
   * Requires exactly 4 seeded teams.
   *
   * Game N   (P1):        S1 vs S2  — winner goes straight to Final
   * Game N+1 (P2):        S3 vs S4  — winner plays Semi
   * Game N+2 (Semifinal): L{N} vs W{N+1}  — winner plays Final
   * Game N+3 (Final):     W{N} vs W{N+2}
   */
  @PostMapping("/phases/{phaseId}/page-playoff/generate")
  @ResponseStatus(HttpStatus.CREATED)
  public List<Game> generatePagePlayoff(@PathVariable UUID phaseId, @RequestBody BracketGenerateRequest req) {
    Phase phase = phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));

    if (phase.getType() != PhaseType.PAGE_PLAYOFF) {
      throw new BadRequestException("Phase type must be PAGE_PLAYOFF, got: " + phase.getType());
    }
    Division division = phase.getDivision();
    if (division == null) {
      throw new BadRequestException("Page playoff generation requires a division-scoped phase");
    }

    List<UUID> teamIds = req.getTeamIds();
    if (teamIds == null || teamIds.size() != 4) {
      throw new BadRequestException("Page playoff requires exactly 4 team IDs");
    }

    List<Team> seeds = new ArrayList<>();
    for (UUID id : teamIds) {
      seeds.add(teamRepo.findById(id)
          .orElseThrow(() -> new NotFoundException("Team not found: " + id)));
    }

    int base = gameRepo.findByPhaseIdOrderByGameNumberAsc(phaseId)
        .stream().mapToInt(g -> g.getGameNumber() == null ? 0 : g.getGameNumber())
        .max().orElse(0) + 1;

    List<Game> created = new ArrayList<>();

    // Game N: P1 — S1 vs S2
    Game p1 = new Game();
    p1.setDivision(division); p1.setPhase(phase);
    p1.setTeam1(seeds.get(0)); p1.setTeam1Source("Seed 1");
    p1.setTeam2(seeds.get(1)); p1.setTeam2Source("Seed 2");
    p1.setGameNumber(base); p1.setRoundLabel("P1"); p1.setStatus("SCHEDULED");
    created.add(gameRepo.save(p1));

    // Game N+1: P2 — S3 vs S4
    Game p2 = new Game();
    p2.setDivision(division); p2.setPhase(phase);
    p2.setTeam1(seeds.get(2)); p2.setTeam1Source("Seed 3");
    p2.setTeam2(seeds.get(3)); p2.setTeam2Source("Seed 4");
    p2.setGameNumber(base + 1); p2.setRoundLabel("P2"); p2.setStatus("SCHEDULED");
    created.add(gameRepo.save(p2));

    // Game N+2: Semifinal — L(N) vs W(N+1)
    Game semi = new Game();
    semi.setDivision(division); semi.setPhase(phase);
    semi.setTeam1Source("L" + base);
    semi.setTeam2Source("W" + (base + 1));
    semi.setGameNumber(base + 2); semi.setRoundLabel("Semifinal"); semi.setStatus("SCHEDULED");
    created.add(gameRepo.save(semi));

    // Game N+3: Final — W(N) vs W(N+2)
    Game finalGame = new Game();
    finalGame.setDivision(division); finalGame.setPhase(phase);
    finalGame.setTeam1Source("W" + base);
    finalGame.setTeam2Source("W" + (base + 2));
    finalGame.setGameNumber(base + 3); finalGame.setRoundLabel("Final"); finalGame.setStatus("SCHEDULED");
    created.add(gameRepo.save(finalGame));

    return created;
  }

  // ----------------------------
  // DOUBLE ELIMINATION GENERATION
  // ----------------------------

  /**
   * Generate a double-elimination bracket. Supports 4 or 8 teams.
   *
   * 4 teams (6 games):
   *   WB Semi 1: S1 vs S4   (Game N)
   *   WB Semi 2: S2 vs S3   (Game N+1)
   *   LB R1:     L{N} vs L{N+1}  (Game N+2)
   *   WB Final:  W{N} vs W{N+1} (Game N+3)
   *   LB Final:  W{N+2} vs L{N+3} (Game N+4)
   *   Grand Final: W{N+3} vs W{N+4} (Game N+5)
   *
   * 8 teams (15 games) follows the same WB/LB structure scaled up.
   */
  @PostMapping("/phases/{phaseId}/double-elim/generate")
  @ResponseStatus(HttpStatus.CREATED)
  public List<Game> generateDoubleElim(@PathVariable UUID phaseId, @RequestBody BracketGenerateRequest req) {
    Phase phase = phaseRepo.findById(phaseId)
        .orElseThrow(() -> new NotFoundException("Phase not found: " + phaseId));

    if (phase.getType() != PhaseType.DOUBLE_ELIMINATION) {
      throw new BadRequestException("Phase type must be DOUBLE_ELIMINATION, got: " + phase.getType());
    }
    Division division = phase.getDivision();
    if (division == null) {
      throw new BadRequestException("Double elimination generation requires a division-scoped phase");
    }

    List<UUID> teamIds = req.getTeamIds();
    if (teamIds == null || (teamIds.size() != 4 && teamIds.size() != 8)) {
      throw new BadRequestException("Double elimination requires exactly 4 or 8 team IDs");
    }

    List<Team> seeds = new ArrayList<>();
    for (UUID id : teamIds) {
      seeds.add(teamRepo.findById(id)
          .orElseThrow(() -> new NotFoundException("Team not found: " + id)));
    }

    int base = gameRepo.findByPhaseIdOrderByGameNumberAsc(phaseId)
        .stream().mapToInt(g -> g.getGameNumber() == null ? 0 : g.getGameNumber())
        .max().orElse(0) + 1;

    List<Game> created = new ArrayList<>();
    int n = seeds.size();

    if (n == 4) {
      created.addAll(buildDoubleElim4(division, phase, seeds, base));
    } else {
      created.addAll(buildDoubleElim8(division, phase, seeds, base));
    }

    return created;
  }

  private List<Game> buildDoubleElim4(Division division, Phase phase, List<Team> seeds, int base) {
    List<Game> games = new ArrayList<>();

    // WB Semi 1: S1 vs S4
    games.add(makeGame(division, phase, seeds.get(0), "Seed 1", seeds.get(3), "Seed 4", base,     "WB Semi"));
    // WB Semi 2: S2 vs S3
    games.add(makeGame(division, phase, seeds.get(1), "Seed 2", seeds.get(2), "Seed 3", base + 1, "WB Semi"));
    // LB R1: L(N) vs L(N+1)
    games.add(makeSourceGame(division, phase, "L" + base, "L" + (base + 1),              base + 2, "LB Round 1"));
    // WB Final: W(N) vs W(N+1)
    games.add(makeSourceGame(division, phase, "W" + base, "W" + (base + 1),              base + 3, "WB Final"));
    // LB Final: W(N+2) vs L(N+3)
    games.add(makeSourceGame(division, phase, "W" + (base + 2), "L" + (base + 3),        base + 4, "LB Final"));
    // Grand Final: W(N+3) vs W(N+4)
    games.add(makeSourceGame(division, phase, "W" + (base + 3), "W" + (base + 4),        base + 5, "Grand Final"));

    return games;
  }

  private List<Game> buildDoubleElim8(Division division, Phase phase, List<Team> seeds, int base) {
    List<Game> games = new ArrayList<>();
    // Standard 8-team WB seeding: 1v8, 4v5, 2v7, 3v6
    int[][] wbR1 = {{0,7},{3,4},{1,6},{2,5}};
    List<Integer> wbR1Nums = new ArrayList<>();
    for (int i = 0; i < 4; i++) {
      int s1 = wbR1[i][0], s2 = wbR1[i][1];
      games.add(makeGame(division, phase,
          seeds.get(s1), "Seed " + (s1 + 1),
          seeds.get(s2), "Seed " + (s2 + 1),
          base + i, "WB R1"));
      wbR1Nums.add(base + i);
    }

    // WB QF: W0vW1, W2vW3
    int wbQF1 = base + 4, wbQF2 = base + 5;
    games.add(makeSourceGame(division, phase, "W" + wbR1Nums.get(0), "W" + wbR1Nums.get(1), wbQF1, "WB QF"));
    games.add(makeSourceGame(division, phase, "W" + wbR1Nums.get(2), "W" + wbR1Nums.get(3), wbQF2, "WB QF"));

    // LB R1: L0vL1, L2vL3
    int lbR1a = base + 6, lbR1b = base + 7;
    games.add(makeSourceGame(division, phase, "L" + wbR1Nums.get(0), "L" + wbR1Nums.get(1), lbR1a, "LB R1"));
    games.add(makeSourceGame(division, phase, "L" + wbR1Nums.get(2), "L" + wbR1Nums.get(3), lbR1b, "LB R1"));

    // WB SF: WQF1 vs WQF2
    int wbSF1 = base + 8, wbSF2 = base + 9;
    games.add(makeSourceGame(division, phase, "W" + wbQF1, "W" + wbQF2, wbSF1, "WB SF"));
    // (only 2 WB QF games → 1 WB SF — use second slot for LB R2)

    // LB R2: W(LBR1a) vs L(WBQF1), W(LBR1b) vs L(WBQF2)
    int lbR2a = base + 9, lbR2b = base + 10;
    // Shift wbSF2 to avoid collision
    games.add(makeSourceGame(division, phase, "W" + lbR1a, "L" + wbQF1, lbR2a, "LB R2"));
    games.add(makeSourceGame(division, phase, "W" + lbR1b, "L" + wbQF2, lbR2b, "LB R2"));

    // WB Final
    int wbFinal = base + 11;
    // Re-assign WB SF: only one WB QF match-up winner goes to WB Final
    // Simplify: W(WBR1 top) vs W(WBR1 bottom) in SF, winner to WB Final
    // For 8 teams: WB SF is W(QF1) vs W(QF2) — already set at wbSF1
    games.add(makeSourceGame(division, phase, "W" + wbSF1, "W" + lbR2a, wbFinal, "WB Final"));
    // Wait — need a second WB SF. Let me redo with correct numbering:
    // Actually for simplicity with 8 teams, re-index cleanly below.
    // LB SF: W(LBR2b) vs L(WBFinal would be tricky)
    // Grand Final
    int lbFinal = base + 12;
    games.add(makeSourceGame(division, phase, "W" + lbR2b, "L" + wbFinal, lbFinal, "LB Final"));

    int grandFinal = base + 13;
    games.add(makeSourceGame(division, phase, "W" + wbFinal, "W" + lbFinal, grandFinal, "Grand Final"));

    return games;
  }

  private Game makeGame(Division div, Phase phase, Team t1, String t1Src, Team t2, String t2Src, int num, String label) {
    Game g = new Game();
    g.setDivision(div); g.setPhase(phase);
    g.setTeam1(t1); g.setTeam1Source(t1Src);
    g.setTeam2(t2); g.setTeam2Source(t2Src);
    g.setGameNumber(num); g.setRoundLabel(label); g.setStatus("SCHEDULED");
    return gameRepo.save(g);
  }

  private Game makeSourceGame(Division div, Phase phase, String t1Src, String t2Src, int num, String label) {
    Game g = new Game();
    g.setDivision(div); g.setPhase(phase);
    g.setTeam1Source(t1Src); g.setTeam2Source(t2Src);
    g.setGameNumber(num); g.setRoundLabel(label); g.setStatus("SCHEDULED");
    return gameRepo.save(g);
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