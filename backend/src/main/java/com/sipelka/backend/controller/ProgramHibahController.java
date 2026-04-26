package com.sipelka.backend.controller;

import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.service.ProgramHibahService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hibah")
public class ProgramHibahController {

    private final ProgramHibahService programHibahService;

    public ProgramHibahController(ProgramHibahService programHibahService) {
        this.programHibahService = programHibahService;
    }

    @PostMapping
    public ResponseEntity<ProgramHibahDTO> createHibah(@RequestBody ProgramHibahDTO dto) {
        return new ResponseEntity<>(programHibahService.createHibah(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgramHibahDTO> updateHibah(@PathVariable UUID id, @RequestBody ProgramHibahDTO dto) {
        return ResponseEntity.ok(programHibahService.updateHibah(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHibah(@PathVariable UUID id) {
        programHibahService.deleteHibah(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgramHibahDTO> getHibahById(@PathVariable UUID id) {
        return ResponseEntity.ok(programHibahService.getHibahById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProgramHibahDTO>> getAllHibah() {
        return ResponseEntity.ok(programHibahService.getAllHibah());
    }

    @GetMapping("/open")
    public ResponseEntity<List<ProgramHibahDTO>> getOpenHibah() {
        return ResponseEntity.ok(programHibahService.getOpenHibah());
    }
}
