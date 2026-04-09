package com.sipelka.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
