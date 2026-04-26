package com.sipelka.backend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.sipelka.backend.model.enums.TipeNotifikasi;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifikasi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notifikasi {

    @Id
    @Column(name = "notifikasi_id", updatable = false, nullable = false)
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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "judul_notifikasi", nullable = false)
    private String judulNotifikasi;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String pesan;

    @Builder.Default
    @Column(name = "is_read")
    private Boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipe_notifikasi")
    private TipeNotifikasi tipeNotifikasi;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
