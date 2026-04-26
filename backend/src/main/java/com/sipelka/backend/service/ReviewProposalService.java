package com.sipelka.backend.service;

import com.sipelka.backend.dto.ReviewProposalDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.ReviewProposal;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.StatusProposal;
import com.sipelka.backend.model.enums.StatusRekomendasi;
import com.sipelka.backend.repository.ProposalRepository;
import com.sipelka.backend.repository.ReviewProposalRepository;
import com.sipelka.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewProposalService {

    private final ReviewProposalRepository reviewProposalRepository;
    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;

    public ReviewProposalService(ReviewProposalRepository reviewProposalRepository, ProposalRepository proposalRepository, UserRepository userRepository) {
        this.reviewProposalRepository = reviewProposalRepository;
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
    }

    public ReviewProposalDTO assignReviewer(UUID proposalId, UUID reviewerId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", proposalId));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        ReviewProposal review = new ReviewProposal();
        review.setProposal(proposal);
        review.setReviewer(reviewer);
        review.setSkorPenilaian(0);
        review.setTanggalReview(LocalDateTime.now());

        return toDto(reviewProposalRepository.save(review));
    }

    @Transactional
    public ReviewProposalDTO submitReview(UUID reviewId, ReviewProposalDTO dto) {
        ReviewProposal review = reviewProposalRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("ReviewProposal", "id", reviewId));

        review.setSkorPenilaian(dto.getSkorPenilaian());
        review.setCatatanRevisi(dto.getCatatanRevisi());
        review.setStatusRekomendasi(dto.getStatusRekomendasi());
        review.setTanggalReview(LocalDateTime.now());

        ReviewProposal savedReview = reviewProposalRepository.save(review);

        // Update Proposal status based on recommendation
        Proposal proposal = review.getProposal();
        if (dto.getStatusRekomendasi() == StatusRekomendasi.LAYAK) {
            proposal.setStatusProposal(StatusProposal.APPROVED);
        } else {
            proposal.setStatusProposal(StatusProposal.REJECTED);
        }
        proposalRepository.save(proposal);

        return toDto(savedReview);
    }

    public List<ReviewProposalDTO> getReviewsByProposal(UUID proposalId) {
        if (!proposalRepository.existsById(proposalId)) {
            throw new ResourceNotFoundException("Proposal", "id", proposalId);
        }
        return reviewProposalRepository.findAll().stream()
                .filter(r -> r.getProposal().getId().equals(proposalId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ReviewProposalDTO> getReviewsByReviewer(UUID reviewerId) {
        if (!userRepository.existsById(reviewerId)) {
            throw new ResourceNotFoundException("User", "id", reviewerId);
        }
        return reviewProposalRepository.findAll().stream()
                .filter(r -> r.getReviewer().getId().equals(reviewerId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ReviewProposalDTO toDto(ReviewProposal review) {
        ReviewProposalDTO dto = new ReviewProposalDTO();
        dto.setId(review.getId());
        dto.setProposalId(review.getProposal().getId());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setSkorPenilaian(review.getSkorPenilaian());
        dto.setCatatanRevisi(review.getCatatanRevisi());
        dto.setStatusRekomendasi(review.getStatusRekomendasi());
        dto.setTanggalReview(review.getTanggalReview());
        return dto;
    }
}
