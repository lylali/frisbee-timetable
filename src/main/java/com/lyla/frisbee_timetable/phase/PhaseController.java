package com.lyla.frisbee_timetable.phase;

import com.lyla.frisbee_timetable.division.Division;
import com.lyla.frisbee_timetable.division.DivisionRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PhaseController {

  private final PhaseRepository phaseRepo;
  private final DivisionRepository divisionRepo;

  public PhaseController(PhaseRepository phaseRepo, DivisionRepository divisionRepo) {
    this.phaseRepo = phaseRepo;
    this.divisionRepo = divisionRepo;
  }

  @GetMapping("/divisions/{divisionId}/phases")
  public List<Phase> list(@PathVariable UUID divisionId) {
    return phaseRepo.findByDivisionIdOrderByOrderIndexAsc(divisionId);
  }

  @PostMapping("/divisions/{divisionId}/phases")
  @ResponseStatus(HttpStatus.CREATED)
  public Phase create(@PathVariable UUID divisionId, @RequestBody CreatePhaseRequest req) {
    Division division = divisionRepo.findById(divisionId)
        .orElseThrow(() -> new IllegalArgumentException("Division not found: " + divisionId));

    Phase p = new Phase();
    p.setDivision(division);
    p.setName(req.getName());
    p.setOrderIndex(req.getOrderIndex());

    return phaseRepo.save(p);
  }
}
