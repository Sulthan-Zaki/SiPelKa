package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.sipelka.backend.model.enums.StatusProposal;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "proposal", indexes = {
        @Index(name = "idx_proposal_status", columnList = "status_proposal"),
        @Index(name = "idx_proposal_peneliti", columnList = "peneliti_id"),
        @Index(name = "idx_proposal_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proposal {

    @Id
    @Column(name = "proposal_id", updatable = false, nullable = false)
    private UUID id;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrderedEpoch();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peneliti_id", nullable = false)
    private User peneliti;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hibah_id", nullable = false)
    private ProgramHibah hibah;

    @Column(name = "judul_penelitian", nullable = false)
    private String judulPenelitian;

    @Column(name = "bidang_penelitian", nullable = false)
    private String bidangPenelitian;

    @Column(columnDefinition = "TEXT")
    private String ringkasan;

    @Column(name = "dokumen_url", nullable = false)
    private String dokumenUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_proposal")
    private StatusProposal statusProposal;

    @Column(name = "kriteria_kelengkapan_dokumen")
    private Boolean kriteriaKelengkapanDokumen;

    @Column(name = "kesesuaian_bidang")
    private Boolean kesesuaianBidang;

    @Column(name = "skor_rule_based")
    private Integer skorRuleBased;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
