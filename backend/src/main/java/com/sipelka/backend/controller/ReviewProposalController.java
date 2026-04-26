package com.sipelka.backend.controller;

import com.sipelka.backend.dto.ReviewProposalDTO;
import com.sipelka.backend.service.ReviewProposalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewProposalController {

    private final ReviewProposalService reviewProposalService;

    public ReviewProposalController(ReviewProposalService reviewProposalService) {
        this.reviewProposalService = reviewProposalService;
    }

    @PostMapping("/assign")
    public ResponseEntity<ReviewProposalDTO> assignReviewer(
            @RequestParam UUID proposalId,
            @RequestParam UUID reviewerId) {
        return new ResponseEntity<>(reviewProposalService.assignReviewer(proposalId, reviewerId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<ReviewProposalDTO> submitReview(
            @PathVariable UUID id,
            @RequestBody ReviewProposalDTO dto) {
        return ResponseEntity.ok(reviewProposalService.submitReview(id, dto));
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<List<ReviewProposalDTO>> getReviewsByProposal(@PathVariable UUID proposalId) {
        return ResponseEntity.ok(reviewProposalService.getReviewsByProposal(proposalId));
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<ReviewProposalDTO>> getReviewsByReviewer(@PathVariable UUID reviewerId) {
        return ResponseEntity.ok(reviewProposalService.getReviewsByReviewer(reviewerId));
    }
}
