package com.sipelka.backend.repository;

import com.sipelka.backend.model.Notifikasi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, UUID> {
}
