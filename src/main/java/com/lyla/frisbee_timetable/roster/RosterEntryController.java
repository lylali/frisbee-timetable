package com.lyla.frisbee_timetable.roster;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.team.TeamRepository;

@RestController
@RequestMapping("/api")
public class RosterEntryController {

  private final RosterEntryRepository repo;
  private final TeamRepository teamRepo;

  public RosterEntryController(RosterEntryRepository repo, TeamRepository teamRepo) {
    this.repo = repo;
    this.teamRepo = teamRepo;
  }

  @GetMapping("/teams/{teamId}/roster")
  public List<RosterEntry> list(@PathVariable UUID teamId) {
    teamRepo.findById(teamId)
        .orElseThrow(() -> new NotFoundException("Team not found: " + teamId));
    return repo.findByTeamId(teamId);
  }

  @PostMapping("/teams/{teamId}/roster")
  @ResponseStatus(HttpStatus.CREATED)
  public RosterEntry add(@PathVariable UUID teamId, @RequestBody AddPlayerRequest req) {
    Team team = teamRepo.findById(teamId)
        .orElseThrow(() -> new NotFoundException("Team not found: " + teamId));
    if (req.getPlayerName() == null || req.getPlayerName().isBlank()) {
      throw new BadRequestException("playerName is required");
    }

    RosterEntry entry = new RosterEntry();
    entry.setTeam(team);
    entry.setPlayerName(req.getPlayerName().trim());
    entry.setPlayerEmail(req.getPlayerEmail());
    return repo.save(entry);
  }

  @DeleteMapping("/roster/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    repo.findById(id).orElseThrow(() -> new NotFoundException("Entry not found: " + id));
    repo.deleteById(id);
  }

  public static class AddPlayerRequest {
    private String playerName, playerEmail;
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public String getPlayerEmail() { return playerEmail; }
    public void setPlayerEmail(String playerEmail) { this.playerEmail = playerEmail; }
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  private static class NotFoundException extends RuntimeException {
    NotFoundException(String msg) { super(msg); }
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  private static class BadRequestException extends RuntimeException {
    BadRequestException(String msg) { super(msg); }
  }
}
