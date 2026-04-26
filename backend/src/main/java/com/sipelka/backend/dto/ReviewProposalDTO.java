package com.sipelka.backend.dto;

import com.sipelka.backend.model.enums.StatusRekomendasi;
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
public class ReviewProposalDTO {
    private UUID id;
    private UUID proposalId;
    private UUID reviewerId;
    private Integer skorPenilaian;
    private String catatanRevisi;
    private StatusRekomendasi statusRekomendasi;
    private LocalDateTime tanggalReview;
}
