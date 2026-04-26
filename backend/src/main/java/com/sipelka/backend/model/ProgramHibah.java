package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "program_hibah")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramHibah {

    @Id
    @Column(name = "hibah_id", updatable = false, nullable = false)
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
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(name = "nama_program", nullable = false)
    private String namaProgram;

    @Column(columnDefinition = "TEXT")
    private String deskripsi;

    @Column(name = "bidang_fokus")
    private String bidangFokus;

    @Column(name = "tanggal_buka", nullable = false)
    private LocalDateTime tanggalBuka;

    @Column(name = "tanggal_tutup", nullable = false)
    private LocalDateTime tanggalTutup;

    @Column(name = "total_dana_maksimal", precision = 15, scale = 2)
    private BigDecimal totalDanaMaksimal;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
