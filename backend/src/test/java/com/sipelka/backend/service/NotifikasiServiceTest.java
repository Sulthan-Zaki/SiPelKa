package com.sipelka.backend.service;

import com.sipelka.backend.dto.NotifikasiDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.enums.TipeNotifikasi;
import com.sipelka.backend.repository.NotifikasiRepository;
import com.sipelka.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
public class NotifikasiServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private NotifikasiService notifikasiService;
    @Autowired private UserService userService;
    @Autowired private NotifikasiRepository notifikasiRepository;
    @Autowired private UserRepository userRepository;

    private UUID userId;
    private UUID user2Id;

    @BeforeEach
    void setUp() {
        notifikasiRepository.deleteAll();
        userRepository.deleteAll();

        UserDto.UserRegistrationRequest req1 = new UserDto.UserRegistrationRequest();
        req1.setName("User Satu"); req1.setEmail("u1@test.com");
        req1.setNip("USR001"); req1.setPassword("pass");
        userId = userService.activateUser(userService.registerUser(req1).getId()).getId();

        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("User Dua"); req2.setEmail("u2@test.com");
        req2.setNip("USR002"); req2.setPassword("pass");
        user2Id = userService.activateUser(userService.registerUser(req2).getId()).getId();
    }

    // ==================== createNotifikasi ====================

    @Test
    void shouldCreateNotifikasiSuccessfully() {
        NotifikasiDTO dto = buildNotifikasiDto(userId, "Proposal Diterima",
                "Proposal Anda telah disetujui.", TipeNotifikasi.STATUS_UPDATE);

        NotifikasiDTO result = notifikasiService.createNotifikasi(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getUserId()).isEqualTo(userId);
        assertThat(result.getIsRead()).isFalse();
        assertThat(result.getTipeNotifikasi()).isEqualTo(TipeNotifikasi.STATUS_UPDATE);
        assertThat(notifikasiRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldCreateNotifikasiWithDeadlineTipe() {
        NotifikasiDTO dto = buildNotifikasiDto(userId, "Deadline Mendekat",
                "Anda hanya punya 3 hari tersisa.", TipeNotifikasi.DEADLINE);
        NotifikasiDTO result = notifikasiService.createNotifikasi(dto);

        assertThat(result.getTipeNotifikasi()).isEqualTo(TipeNotifikasi.DEADLINE);
    }

    @Test
    void shouldCreateNotifikasiWithSystemTipe() {
        NotifikasiDTO dto = buildNotifikasiDto(userId, "Pemeliharaan Sistem",
                "Sistem akan down jam 2 pagi.", TipeNotifikasi.SYSTEM);
        NotifikasiDTO result = notifikasiService.createNotifikasi(dto);

        assertThat(result.getTipeNotifikasi()).isEqualTo(TipeNotifikasi.SYSTEM);
    }

    @Test
    void shouldAlwaysSetIsReadToFalseOnCreate() {
        NotifikasiDTO dto = buildNotifikasiDto(userId, "Test", "Pesan", TipeNotifikasi.SYSTEM);
        dto.setIsRead(true); // Should be ignored by service

        NotifikasiDTO result = notifikasiService.createNotifikasi(dto);

        assertThat(result.getIsRead()).isFalse();
    }

    @Test
    void shouldCreateMultipleNotifikasiForSameUser() {
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "Notif 1", "Pesan 1", TipeNotifikasi.SYSTEM));
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "Notif 2", "Pesan 2", TipeNotifikasi.DEADLINE));
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "Notif 3", "Pesan 3", TipeNotifikasi.STATUS_UPDATE));

        assertThat(notifikasiRepository.count()).isEqualTo(3);
    }

    @Test
    void shouldThrowWhenCreatingNotifikasiForNonExistentUser() {
        NotifikasiDTO dto = buildNotifikasiDto(UUID.randomUUID(), "Test", "Pesan", TipeNotifikasi.SYSTEM);

        assertThatThrownBy(() -> notifikasiService.createNotifikasi(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    // ==================== markAsRead ====================

    @Test
    void shouldMarkNotifikasiAsReadSuccessfully() {
        NotifikasiDTO created = notifikasiService.createNotifikasi(
                buildNotifikasiDto(userId, "Unread", "Belum dibaca", TipeNotifikasi.SYSTEM));
        assertThat(created.getIsRead()).isFalse();

        NotifikasiDTO updated = notifikasiService.markAsRead(created.getId());

        assertThat(updated.getIsRead()).isTrue();
    }

    @Test
    void shouldBeIdempotentWhenMarkingAlreadyReadNotifikasi() {
        NotifikasiDTO created = notifikasiService.createNotifikasi(
                buildNotifikasiDto(userId, "Already Read", "Sudah dibaca", TipeNotifikasi.SYSTEM));

        notifikasiService.markAsRead(created.getId());
        NotifikasiDTO again = notifikasiService.markAsRead(created.getId()); // Second time

        assertThat(again.getIsRead()).isTrue(); // Still true, no error
    }

    @Test
    void shouldThrowWhenMarkingNonExistentNotifikasiAsRead() {
        assertThatThrownBy(() -> notifikasiService.markAsRead(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Notifikasi");
    }

    // ==================== getNotifikasiByUser ====================

    @Test
    void shouldGetNotifikasiByUserSuccessfully() {
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "N1", "P1", TipeNotifikasi.SYSTEM));
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "N2", "P2", TipeNotifikasi.DEADLINE));

        List<NotifikasiDTO> result = notifikasiService.getNotifikasiByUser(userId);
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(n -> n.getUserId().equals(userId));
    }

    @Test
    void shouldOnlyReturnNotifikasiForRequestedUser() {
        // Notifikasi for user 1
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "U1-N1", "Pesan", TipeNotifikasi.SYSTEM));
        notifikasiService.createNotifikasi(buildNotifikasiDto(userId, "U1-N2", "Pesan", TipeNotifikasi.DEADLINE));
        // Notifikasi for user 2
        notifikasiService.createNotifikasi(buildNotifikasiDto(user2Id, "U2-N1", "Pesan", TipeNotifikasi.SYSTEM));

        List<NotifikasiDTO> user1Notif = notifikasiService.getNotifikasiByUser(userId);
        List<NotifikasiDTO> user2Notif = notifikasiService.getNotifikasiByUser(user2Id);

        assertThat(user1Notif).hasSize(2);
        assertThat(user2Notif).hasSize(1);
    }

    @Test
    void shouldReturnEmptyWhenUserHasNoNotifikasi() {
        List<NotifikasiDTO> result = notifikasiService.getNotifikasiByUser(userId);
        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowWhenGettingNotifikasiForNonExistentUser() {
        assertThatThrownBy(() -> notifikasiService.getNotifikasiByUser(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    void shouldReflectReadStatusInGetByUser() {
        NotifikasiDTO n1 = notifikasiService.createNotifikasi(
                buildNotifikasiDto(userId, "N1", "P1", TipeNotifikasi.SYSTEM));
        notifikasiService.createNotifikasi(
                buildNotifikasiDto(userId, "N2", "P2", TipeNotifikasi.DEADLINE));

        notifikasiService.markAsRead(n1.getId());

        List<NotifikasiDTO> result = notifikasiService.getNotifikasiByUser(userId);
        long readCount = result.stream().filter(NotifikasiDTO::getIsRead).count();
        long unreadCount = result.stream().filter(n -> !n.getIsRead()).count();

        assertThat(readCount).isEqualTo(1);
        assertThat(unreadCount).isEqualTo(1);
    }

    // ==================== helper ====================

    private NotifikasiDTO buildNotifikasiDto(UUID userId, String judul, String pesan, TipeNotifikasi tipe) {
        NotifikasiDTO dto = new NotifikasiDTO();
        dto.setUserId(userId);
        dto.setJudulNotifikasi(judul);
        dto.setPesan(pesan);
        dto.setTipeNotifikasi(tipe);
        return dto;
    }
}
