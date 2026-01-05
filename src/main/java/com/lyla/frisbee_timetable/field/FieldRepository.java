package com.lyla.frisbee_timetable.field;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldRepository extends JpaRepository<Field, UUID> {
  List<Field> findByTournamentIdOrderByNameAsc(UUID tournamentId);
}
