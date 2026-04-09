package com.sipelka.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import com.github.f4b6a3.uuid.UuidCreator;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(updatable = false, nullable = false)
    private UUID id;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrderedEpoch();
        }
    }


    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /**
     * NIP (Nomor Induk Pegawai) — unique teacher/staff identification number.
     */
    @Column(nullable = false, unique = true, length = 20)
    private String nip;

    @Column(nullable = false)
    private String password;
}
