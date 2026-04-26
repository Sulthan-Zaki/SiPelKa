package com.sipelka.backend.dto;

import com.sipelka.backend.model.enums.TipeNotifikasi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotifikasiDTO {
    private UUID id;
    private UUID userId;
    private String judulNotifikasi;
    private String pesan;
    private Boolean isRead;
    private TipeNotifikasi tipeNotifikasi;
    private LocalDateTime createdAt;
}
