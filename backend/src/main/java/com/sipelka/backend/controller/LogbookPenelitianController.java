package com.sipelka.backend.controller;

import com.sipelka.backend.dto.LogbookPenelitianDTO;
import com.sipelka.backend.service.LogbookPenelitianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logbooks")
public class LogbookPenelitianController {

    private final LogbookPenelitianService logbookPenelitianService;

    public LogbookPenelitianController(LogbookPenelitianService logbookPenelitianService) {
        this.logbookPenelitianService = logbookPenelitianService;
    }

    @PostMapping
    public ResponseEntity<LogbookPenelitianDTO> createLogbook(@RequestBody LogbookPenelitianDTO dto) {
        return new ResponseEntity<>(logbookPenelitianService.createLogbook(dto), HttpStatus.CREATED);
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<List<LogbookPenelitianDTO>> getLogbooksByProposal(@PathVariable UUID proposalId) {
        return ResponseEntity.ok(logbookPenelitianService.getLogbooksByProposal(proposalId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LogbookPenelitianDTO> updateLogbook(@PathVariable UUID id, @RequestBody LogbookPenelitianDTO dto) {
        return ResponseEntity.ok(logbookPenelitianService.updateLogbook(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLogbook(@PathVariable UUID id) {
        logbookPenelitianService.deleteLogbook(id);
        return ResponseEntity.noContent().build();
    }
}
