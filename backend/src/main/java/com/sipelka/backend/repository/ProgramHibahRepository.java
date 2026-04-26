package com.sipelka.backend.repository;

import com.sipelka.backend.model.ProgramHibah;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProgramHibahRepository extends JpaRepository<ProgramHibah, UUID> {
}
