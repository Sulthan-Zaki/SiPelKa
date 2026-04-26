package com.sipelka.backend.service;

import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.enums.UserRole;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
public class ProgramHibahServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private ProgramHibahService programHibahService;
    @Autowired private UserService userService;
    @Autowired private ProgramHibahRepository programHibahRepository;
    @Autowired private UserRepository userRepository;

    private UUID adminId;

    @BeforeEach
    void setUp() {
        programHibahRepository.deleteAll();
        userRepository.deleteAll();

        // Create a fresh admin for each test
        UserDto.AdminRegistrationRequest req = new UserDto.AdminRegistrationRequest();
        req.setName("Admin Test");
        req.setEmail("admin@test.com");
        req.setNip("ADM001");
        req.setPassword("adminpass");
        req.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        adminId = userService.registerAdmin(req).getId();
    }

    // ==================== createHibah ====================

    @Test
    void shouldCreateHibahSuccessfully() {
        ProgramHibahDTO dto = buildHibahDto(adminId, "AI Research Grant",
                LocalDateTime.now().minusDays(1), LocalDateTime.now().plusMonths(3));

        ProgramHibahDTO result = programHibahService.createHibah(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNamaProgram()).isEqualTo("AI Research Grant");
        assertThat(result.getAdminId()).isEqualTo(adminId);
        assertThat(programHibahRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldThrowWhenCreatingHibahWithNonExistentAdmin() {
        UUID randomAdminId = UUID.randomUUID();
        ProgramHibahDTO dto = buildHibahDto(randomAdminId, "Ghost Grant",
                LocalDateTime.now(), LocalDateTime.now().plusDays(10));

        assertThatThrownBy(() -> programHibahService.createHibah(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    // ==================== updateHibah ====================

    @Test
    void shouldUpdateHibahSuccessfully() {
        ProgramHibahDTO created = programHibahService.createHibah(
                buildHibahDto(adminId, "Old Name", LocalDateTime.now(), LocalDateTime.now().plusDays(30)));

        ProgramHibahDTO updateDto = buildHibahDto(adminId, "Updated Name",
                LocalDateTime.now(), LocalDateTime.now().plusDays(60));
        ProgramHibahDTO updated = programHibahService.updateHibah(created.getId(), updateDto);

        assertThat(updated.getNamaProgram()).isEqualTo("Updated Name");
    }

    @Test
    void shouldThrowWhenUpdatingNonExistentHibah() {
        UUID fakeId = UUID.randomUUID();
        ProgramHibahDTO dto = buildHibahDto(adminId, "Some Grant",
                LocalDateTime.now(), LocalDateTime.now().plusDays(10));

        assertThatThrownBy(() -> programHibahService.updateHibah(fakeId, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ProgramHibah");
    }

    // ==================== deleteHibah ====================

    @Test
    void shouldDeleteHibahSuccessfully() {
        ProgramHibahDTO created = programHibahService.createHibah(
                buildHibahDto(adminId, "To Delete", LocalDateTime.now(), LocalDateTime.now().plusDays(5)));
        assertThat(programHibahRepository.count()).isEqualTo(1);

        programHibahService.deleteHibah(created.getId());

        assertThat(programHibahRepository.count()).isEqualTo(0);
    }

    @Test
    void shouldThrowWhenDeletingNonExistentHibah() {
        UUID fakeId = UUID.randomUUID();
        assertThatThrownBy(() -> programHibahService.deleteHibah(fakeId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ProgramHibah");
    }

    // ==================== getHibahById ====================

    @Test
    void shouldGetHibahByIdSuccessfully() {
        ProgramHibahDTO created = programHibahService.createHibah(
                buildHibahDto(adminId, "Find Me", LocalDateTime.now(), LocalDateTime.now().plusDays(5)));

        ProgramHibahDTO found = programHibahService.getHibahById(created.getId());
        assertThat(found.getNamaProgram()).isEqualTo("Find Me");
    }

    @Test
    void shouldThrowWhenGettingNonExistentHibah() {
        assertThatThrownBy(() -> programHibahService.getHibahById(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ProgramHibah");
    }

    // ==================== getAllHibah ====================

    @Test
    void shouldGetAllHibahAndReturnCorrectCount() {
        programHibahService.createHibah(buildHibahDto(adminId, "Grant A",
                LocalDateTime.now(), LocalDateTime.now().plusDays(10)));
        programHibahService.createHibah(buildHibahDto(adminId, "Grant B",
                LocalDateTime.now(), LocalDateTime.now().plusDays(20)));

        List<ProgramHibahDTO> all = programHibahService.getAllHibah();
        assertThat(all).hasSize(2);
    }

    @Test
    void shouldReturnEmptyListWhenNoHibahExists() {
        List<ProgramHibahDTO> all = programHibahService.getAllHibah();
        assertThat(all).isEmpty();
    }

    // ==================== getOpenHibah ====================

    @Test
    void shouldReturnOnlyOpenHibah() {
        // Open: tanggalBuka in past, tanggalTutup in future
        programHibahService.createHibah(buildHibahDto(adminId, "Open Grant",
                LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(30)));
        // Closed: both dates in past
        programHibahService.createHibah(buildHibahDto(adminId, "Expired Grant",
                LocalDateTime.now().minusDays(60), LocalDateTime.now().minusDays(30)));
        // Not yet open: tanggalBuka in future
        programHibahService.createHibah(buildHibahDto(adminId, "Future Grant",
                LocalDateTime.now().plusDays(5), LocalDateTime.now().plusDays(60)));

        List<ProgramHibahDTO> openGrants = programHibahService.getOpenHibah();
        assertThat(openGrants).hasSize(1);
        assertThat(openGrants.get(0).getNamaProgram()).isEqualTo("Open Grant");
    }

    @Test
    void shouldReturnEmptyWhenNoOpenHibah() {
        // All expired
        programHibahService.createHibah(buildHibahDto(adminId, "Expired A",
                LocalDateTime.now().minusDays(60), LocalDateTime.now().minusDays(1)));

        List<ProgramHibahDTO> openGrants = programHibahService.getOpenHibah();
        assertThat(openGrants).isEmpty();
    }

    // ==================== helper ====================

    private ProgramHibahDTO buildHibahDto(UUID adminId, String nama,
                                          LocalDateTime buka, LocalDateTime tutup) {
        ProgramHibahDTO dto = new ProgramHibahDTO();
        dto.setAdminId(adminId);
        dto.setNamaProgram(nama);
        dto.setDeskripsi("Deskripsi " + nama);
        dto.setBidangFokus("Teknologi");
        dto.setTanggalBuka(buka);
        dto.setTanggalTutup(tutup);
        dto.setTotalDanaMaksimal(BigDecimal.valueOf(50_000_000));
        return dto;
    }
}
