package com.sipelka.backend.dto;

import com.sipelka.backend.model.enums.StatusProposal;
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
public class ProposalDTO {
    private UUID id;
    private UUID penelitiId;
    private String penelitiName;
    private UUID hibahId;
    private String hibahName;
    private String judulPenelitian;
    private String bidangPenelitian;
    private String ringkasan;
    private String dokumenUrl;
    private StatusProposal statusProposal;
    private Boolean kriteriaKelengkapanDokumen;
    private Boolean kesesuaianBidang;
    private Integer skorRuleBased;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
