package com.sipelka.backend.repository;

import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.enums.StatusProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, UUID> {

    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah")
    List<Proposal> findAllWithPenelitiAndHibah();

    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah WHERE p.id = :id")
    Optional<Proposal> findByIdWithPenelitiAndHibah(@Param("id") UUID id);

    List<Proposal> findByPenelitiIdAndStatusProposal(UUID penelitiId, StatusProposal status);

    long countByPenelitiIdAndStatusProposal(UUID penelitiId, StatusProposal status);
}
