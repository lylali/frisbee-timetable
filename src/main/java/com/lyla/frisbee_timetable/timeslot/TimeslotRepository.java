package com.lyla.frisbee_timetable.timeslot;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeslotRepository extends JpaRepository<Timeslot, UUID> {
  List<Timeslot> findByTournamentIdOrderByDayDateAscStartTimeAsc(UUID tournamentId);
}
