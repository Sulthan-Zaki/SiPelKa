package com.sipelka.backend.repository;

import com.sipelka.backend.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, UUID> {

    @Query("SELECT p FROM Proposal p LEFT JOIN FETCH p.peneliti LEFT JOIN FETCH p.hibah")
    java.util.List<Proposal> findAllWithPenelitiAndHibah();
}
