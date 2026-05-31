package com.sipelka.backend.controller;

import com.sipelka.backend.dto.PencairanDanaDTO;
import com.sipelka.backend.model.enums.StatusPencairan;
import com.sipelka.backend.service.PencairanDanaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pencairan")
public class PencairanDanaController {

    private final PencairanDanaService pencairanDanaService;

    public PencairanDanaController(PencairanDanaService pencairanDanaService) {
        this.pencairanDanaService = pencairanDanaService;
    }

    @PostMapping
    public ResponseEntity<PencairanDanaDTO> createPencairan(@RequestBody PencairanDanaDTO dto) {
        return new ResponseEntity<>(pencairanDanaService.createPencairan(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PencairanDanaDTO> updateStatusPencairan(
            @PathVariable UUID id,
            @RequestParam StatusPencairan status,
            @RequestParam(required = false) String buktiTransferUrl) {
        return ResponseEntity.ok(pencairanDanaService.updateStatusPencairan(id, status, buktiTransferUrl));
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<List<PencairanDanaDTO>> getPencairanByProposal(@PathVariable UUID proposalId) {
        return ResponseEntity.ok(pencairanDanaService.getPencairanByProposal(proposalId));
    }

    @GetMapping
    public ResponseEntity<List<PencairanDanaDTO>> getAllPencairan() {
        return ResponseEntity.ok(pencairanDanaService.getAllPencairan());
    }

    @GetMapping("/stats")
    public ResponseEntity<PencairanDanaService.PencairanStats> getStats() {
        return ResponseEntity.ok(pencairanDanaService.getStats());
    }
}
