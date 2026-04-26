package com.sipelka.backend.repository;

import com.sipelka.backend.model.PencairanDana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PencairanDanaRepository extends JpaRepository<PencairanDana, UUID> {
}
