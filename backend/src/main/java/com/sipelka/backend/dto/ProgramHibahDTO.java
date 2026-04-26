package com.sipelka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramHibahDTO {
    private UUID id;
    private UUID adminId;
    private String namaProgram;
    private String deskripsi;
    private String bidangFokus;
    private LocalDateTime tanggalBuka;
    private LocalDateTime tanggalTutup;
    private BigDecimal totalDanaMaksimal;
    private LocalDateTime createdAt;
}
