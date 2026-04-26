package com.sipelka.backend.controller;

import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.service.ProposalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    @PostMapping
    public ResponseEntity<ProposalDTO> createProposal(@RequestBody ProposalDTO dto) {
        return new ResponseEntity<>(proposalService.createProposal(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProposalDTO> updateProposal(@PathVariable UUID id, @RequestBody ProposalDTO dto) {
        return ResponseEntity.ok(proposalService.updateProposal(id, dto));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ProposalDTO> submitProposal(@PathVariable UUID id) {
        return ResponseEntity.ok(proposalService.submitProposal(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProposalDTO> getProposalById(@PathVariable UUID id) {
        return ResponseEntity.ok(proposalService.getProposalById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProposalDTO>> getAllProposals() {
        return ResponseEntity.ok(proposalService.getAllProposals());
    }

    @GetMapping("/peneliti/{penelitiId}")
    public ResponseEntity<List<ProposalDTO>> getProposalsByPeneliti(@PathVariable UUID penelitiId) {
        return ResponseEntity.ok(proposalService.getProposalsByPeneliti(penelitiId));
    }
}
