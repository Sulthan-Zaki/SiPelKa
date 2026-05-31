package com.sipelka.backend.repository;

import com.sipelka.backend.model.Proposal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, UUID> {

    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah")
    List<Proposal> findAllWithPenelitiAndHibah();

    /**
     * Aggregates proposal counts grouped by status at the database level.
     * Returns rows of [StatusProposal, Long]. Used by the dashboard stats endpoint
     * instead of loading every row into memory.
     */
    @Query("SELECT p.statusProposal, COUNT(p) FROM Proposal p GROUP BY p.statusProposal")
    List<Object[]> countGroupedByStatus();

    /**
     * Fetches all proposals for a single researcher with related entities eagerly
     * loaded, replacing the previous findAll()-then-filter approach (full table
     * scan + N+1 lazy loads).
     */
    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah WHERE p.peneliti.id = :penelitiId")
    List<Proposal> findByPenelitiIdWithDetails(@Param("penelitiId") UUID penelitiId);

    /**
     * Newest proposals first, with related entities eagerly loaded. The caller
     * controls the limit via Pageable so the UI need not fetch the full table.
     * Only single-valued (ManyToOne) joins are fetched, so DB-side pagination is safe.
     */
    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah ORDER BY p.createdAt DESC")
    List<Proposal> findRecentWithDetails(Pageable pageable);

    /**
     * Monthly proposal counts since the given cutoff, grouped by calendar year and
     * month. Returns rows of [year, month, count]. Native query so PostgreSQL's
     * EXTRACT is used directly.
     */
    @Query(value = "SELECT EXTRACT(YEAR FROM created_at) AS yr, EXTRACT(MONTH FROM created_at) AS mon, COUNT(*) AS cnt " +
            "FROM proposal WHERE created_at >= :since GROUP BY yr, mon ORDER BY yr, mon", nativeQuery = true)
    List<Object[]> countMonthlySince(@Param("since") LocalDateTime since);
}
