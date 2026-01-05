package com.lyla.frisbee_timetable.division;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DivisionRepository extends JpaRepository<Division, UUID> {
  List<Division> findByTournamentIdOrderByOrderIndexAsc(UUID tournamentId);
}
