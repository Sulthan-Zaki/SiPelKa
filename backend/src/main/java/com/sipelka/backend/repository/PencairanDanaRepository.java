package com.sipelka.backend.repository;

import com.sipelka.backend.model.PencairanDana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PencairanDanaRepository extends JpaRepository<PencairanDana, UUID> {

    @Query("SELECT p FROM PencairanDana p LEFT JOIN FETCH p.proposal LEFT JOIN FETCH p.admin LEFT JOIN FETCH p.proposal.peneliti LEFT JOIN FETCH p.proposal.hibah")
    java.util.List<PencairanDana> findAllWithProposalAndAdmin();
}
