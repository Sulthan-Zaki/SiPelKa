package com.sipelka.backend.controller;

import com.sipelka.backend.dto.NotifikasiDTO;
import com.sipelka.backend.service.NotifikasiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifikasi")
public class NotifikasiController {

    private final NotifikasiService notifikasiService;

    public NotifikasiController(NotifikasiService notifikasiService) {
        this.notifikasiService = notifikasiService;
    }

    @PostMapping
    public ResponseEntity<NotifikasiDTO> createNotifikasi(@RequestBody NotifikasiDTO dto) {
        return new ResponseEntity<>(notifikasiService.createNotifikasi(dto), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotifikasiDTO>> getNotifikasiByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(notifikasiService.getNotifikasiByUser(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotifikasiDTO> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notifikasiService.markAsRead(id));
    }
}
