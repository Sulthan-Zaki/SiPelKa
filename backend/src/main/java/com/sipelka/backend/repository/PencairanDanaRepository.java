package com.sipelka.backend.repository;

import com.sipelka.backend.model.PencairanDana;
import com.sipelka.backend.model.enums.StatusPencairan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface PencairanDanaRepository extends JpaRepository<PencairanDana, UUID> {

    @Query("SELECT p FROM PencairanDana p LEFT JOIN FETCH p.proposal LEFT JOIN FETCH p.admin LEFT JOIN FETCH p.proposal.peneliti LEFT JOIN FETCH p.proposal.hibah")
    java.util.List<PencairanDana> findAllWithProposalAndAdmin();

    /**
     * Sums disbursement amounts for the given status at the database level.
     * Returns 0 (via COALESCE) when no rows match.
     */
    @Query("SELECT COALESCE(SUM(p.jumlahDana), 0) FROM PencairanDana p WHERE p.statusPencairan = :status")
    BigDecimal sumJumlahDanaByStatus(@Param("status") StatusPencairan status);
}
