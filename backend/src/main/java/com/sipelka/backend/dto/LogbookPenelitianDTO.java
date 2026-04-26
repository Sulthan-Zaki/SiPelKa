package com.sipelka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogbookPenelitianDTO {
    private UUID id;
    private UUID proposalId;
    private LocalDate tanggalKegiatan;
    private String deskripsiProgress;
    private String kendala;
    private String lampiranUrl;
    private LocalDateTime createdAt;
}
