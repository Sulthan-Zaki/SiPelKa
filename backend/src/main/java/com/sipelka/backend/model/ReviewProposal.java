package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.sipelka.backend.model.enums.StatusRekomendasi;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "review_proposal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewProposal {

    @Id
    @Column(name = "review_id", updatable = false, nullable = false)
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
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(name = "skor_penilaian", nullable = false)
    private Integer skorPenilaian;

    @Column(name = "catatan_revisi", columnDefinition = "TEXT")
    private String catatanRevisi;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_rekomendasi")
    private StatusRekomendasi statusRekomendasi;

    @Column(name = "tanggal_review")
    private LocalDateTime tanggalReview;
}
