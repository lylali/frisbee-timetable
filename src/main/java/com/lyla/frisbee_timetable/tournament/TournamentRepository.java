package com.lyla.frisbee_timetable.tournament;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, UUID> {}
