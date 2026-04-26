package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "logbook_penelitian")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogbookPenelitian {

    @Id
    @Column(name = "logbook_id", updatable = false, nullable = false)
    private UUID id;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrderedEpoch();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @Column(name = "tanggal_kegiatan", nullable = false)
    private LocalDate tanggalKegiatan;

    @Column(name = "deskripsi_progress", nullable = false, columnDefinition = "TEXT")
    private String deskripsiProgress;

    @Column(columnDefinition = "TEXT")
    private String kendala;

    @Column(name = "lampiran_url")
    private String lampiranUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
