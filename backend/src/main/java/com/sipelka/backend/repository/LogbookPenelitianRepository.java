package com.sipelka.backend.repository;

import com.sipelka.backend.model.LogbookPenelitian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LogbookPenelitianRepository extends JpaRepository<LogbookPenelitian, UUID> {
    List<LogbookPenelitian> findByProposalIdInOrderByCreatedAtDesc(List<UUID> proposalIds);

    List<LogbookPenelitian> findByProposalIdOrderByTanggalKegiatanDesc(UUID proposalId);

    List<LogbookPenelitian> findByProposalIdIn(List<UUID> proposalIds);
}
