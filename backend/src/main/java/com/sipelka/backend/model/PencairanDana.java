package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.sipelka.backend.model.enums.StatusPencairan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pencairan_dana")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PencairanDana {

    @Id
    @Column(name = "pencairan_id", updatable = false, nullable = false)
    private UUID id;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrderedEpoch();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(name = "tahap_pencairan", nullable = false)
    private Integer tahapPencairan;

    @Column(name = "jumlah_dana", nullable = false, precision = 15, scale = 2)
    private BigDecimal jumlahDana;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pencairan", nullable = false)
    private StatusPencairan statusPencairan;

    @Column(name = "tanggal_pencairan")
    private LocalDateTime tanggalPencairan;

    @Column(name = "bukti_transfer_url")
    private String buktiTransferUrl;
}
