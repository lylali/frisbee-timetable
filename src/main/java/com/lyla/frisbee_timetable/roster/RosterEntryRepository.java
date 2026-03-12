package com.lyla.frisbee_timetable.roster;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RosterEntryRepository extends JpaRepository<RosterEntry, UUID> {
  List<RosterEntry> findByTeamId(UUID teamId);
}
