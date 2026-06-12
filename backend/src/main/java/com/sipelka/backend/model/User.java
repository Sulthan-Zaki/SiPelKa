package com.sipelka.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import com.github.f4b6a3.uuid.UuidCreator;
import com.sipelka.backend.model.enums.UserRole;

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

    @Column(nullable = false, unique = true, length = 20)
    private String nip;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActivated = false;

    @Column(nullable = false)
    private String password;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.RESEARCHER;

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean activated) {
        isActivated = activated;
    }
}
