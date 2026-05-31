package com.sipelka.backend.dto;

import com.sipelka.backend.model.enums.StatusPencairan;
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
public class PencairanDanaDTO {
    private UUID id;
    private UUID proposalId;
    private String proposalTitle;
    private String penelitiName;
    private UUID adminId;
    private Integer tahapPencairan;
    private BigDecimal jumlahDana;
    private StatusPencairan statusPencairan;
    private LocalDateTime tanggalPencairan;
    private String buktiTransferUrl;
}
