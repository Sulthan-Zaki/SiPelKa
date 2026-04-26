package com.sipelka.backend.repository;

import com.sipelka.backend.model.ReviewProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewProposalRepository extends JpaRepository<ReviewProposal, UUID> {
}
