package com.lyla.frisbee_timetable.phase;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PhaseRepository extends JpaRepository<Phase, UUID> {
  List<Phase> findByDivisionIdOrderByOrderIndexAsc(UUID divisionId);
}
