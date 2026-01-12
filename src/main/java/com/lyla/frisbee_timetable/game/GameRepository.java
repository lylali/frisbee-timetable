package com.lyla.frisbee_timetable.game;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, UUID> {

  List<Game> findByDivisionIdOrderByGameNumberAsc(UUID divisionId);

  List<Game> findByDivisionIdAndTimeslotIdOrderByGameNumberAsc(UUID divisionId, UUID timeslotId);
}
