package com.lyla.frisbee_timetable.user;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.team.Team;
import com.lyla.frisbee_timetable.team.TeamRepository;
import com.lyla.frisbee_timetable.tournament.Tournament;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepository userRepo;
  private final TeamRepository teamRepo;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public AuthController(UserRepository userRepo, TeamRepository teamRepo) {
    this.userRepo = userRepo;
    this.teamRepo = teamRepo;
  }

  // POST /api/auth/register
  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public UserDto register(@RequestBody RegisterRequest req) {
    if (req.getEmail() == null || req.getEmail().isBlank()) throw new BadRequestException("email is required");
    if (req.getName() == null || req.getName().isBlank()) throw new BadRequestException("name is required");
    if (req.getPassword() == null || req.getPassword().length() < 6) throw new BadRequestException("password must be at least 6 characters");

    String email = req.getEmail().toLowerCase().trim();
    if (userRepo.findByEmail(email).isPresent()) throw new ConflictException("Email already registered");

    User u = new User();
    u.setEmail(email);
    u.setName(req.getName().trim());
    u.setPasswordHash(encoder.encode(req.getPassword()));
    User saved = userRepo.save(u);
    return new UserDto(saved.getId(), saved.getEmail(), saved.getName());
  }

  // POST /api/auth/login
  @PostMapping("/login")
  public UserDto login(@RequestBody LoginRequest req) {
    String email = req.getEmail() == null ? "" : req.getEmail().toLowerCase().trim();
    User u = userRepo.findByEmail(email)
        .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
    if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return new UserDto(u.getId(), u.getEmail(), u.getName());
  }

  // GET /api/auth/users/{id}
  @GetMapping("/users/{id}")
  public UserDto getUser(@PathVariable UUID id) {
    User u = userRepo.findById(id)
        .orElseThrow(() -> new NotFoundException("User not found"));
    return new UserDto(u.getId(), u.getEmail(), u.getName());
  }

  // GET /api/auth/users/{id}/teams — all teams registered by this leader
  @GetMapping("/users/{id}/teams")
  public List<Map<String, Object>> getUserTeams(@PathVariable UUID id) {
    return teamRepo.findByLeaderId(id).stream().map(t -> {
      Map<String, Object> dto = new LinkedHashMap<>();
      dto.put("teamId", t.getId());
      dto.put("teamName", t.getName());
      dto.put("club", t.getClub());
      Division d = t.getDivision();
      dto.put("divisionId", d.getId());
      dto.put("divisionName", d.getName());
      Tournament tr = d.getTournament();
      dto.put("tournamentId", tr.getId());
      dto.put("tournamentName", tr.getName());
      return dto;
    }).toList();
  }

  // ------- DTOs -------
  public record UserDto(UUID id, String email, String name) {}

  public static class RegisterRequest {
    private String email, name, password;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
  }

  public static class LoginRequest {
    private String email, password;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
  }

  // ------- Exceptions -------
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  private static class BadRequestException extends RuntimeException {
    BadRequestException(String msg) { super(msg); }
  }

  @ResponseStatus(HttpStatus.CONFLICT)
  private static class ConflictException extends RuntimeException {
    ConflictException(String msg) { super(msg); }
  }

  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  private static class UnauthorizedException extends RuntimeException {
    UnauthorizedException(String msg) { super(msg); }
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  private static class NotFoundException extends RuntimeException {
    NotFoundException(String msg) { super(msg); }
  }
}
