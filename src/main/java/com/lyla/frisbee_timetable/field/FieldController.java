package com.lyla.frisbee_timetable.field;

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
public class FieldController {

  private final FieldRepository repo;
  private final TournamentRepository tournamentRepo;

  public FieldController(FieldRepository repo, TournamentRepository tournamentRepo) {
    this.repo = repo;
    this.tournamentRepo = tournamentRepo;
  }

  @GetMapping("/tournaments/{tournamentId}/fields")
  public List<Field> list(@PathVariable UUID tournamentId) {
    return repo.findByTournamentIdOrderByNameAsc(tournamentId);
  }

  @PostMapping("/tournaments/{tournamentId}/fields")
  @ResponseStatus(HttpStatus.CREATED)
  public Field create(
      @PathVariable UUID tournamentId,
      @Valid @RequestBody CreateFieldRequest req
  ) {
    Tournament t = tournamentRepo.findById(tournamentId)
        .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

    Field f = new Field();
    f.setTournament(t);
    f.setName(req.getName());
    f.setLocationNote(req.getLocationNote());
    return repo.save(f);
  }
}
