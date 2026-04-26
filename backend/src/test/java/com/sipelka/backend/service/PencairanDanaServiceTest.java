package com.sipelka.backend.service;

import com.sipelka.backend.dto.PencairanDanaDTO;
import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.enums.StatusPencairan;
import com.sipelka.backend.repository.PencairanDanaRepository;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.ProposalRepository;
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
public class PencairanDanaServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private PencairanDanaService pencairanDanaService;
    @Autowired private ProposalService proposalService;
    @Autowired private ProgramHibahService programHibahService;
    @Autowired private UserService userService;
    @Autowired private PencairanDanaRepository pencairanDanaRepository;
    @Autowired private ProposalRepository proposalRepository;
    @Autowired private ProgramHibahRepository programHibahRepository;
    @Autowired private UserRepository userRepository;

    private UUID adminId;
    private UUID proposalId;

    @BeforeEach
    void setUp() {
        pencairanDanaRepository.deleteAll();
        proposalRepository.deleteAll();
        programHibahRepository.deleteAll();
        userRepository.deleteAll();

        // Admin
        UserDto.AdminRegistrationRequest adminReq = new UserDto.AdminRegistrationRequest();
        adminReq.setName("Admin"); adminReq.setEmail("admin@test.com");
        adminReq.setNip("ADM001"); adminReq.setPassword("pass");
        adminReq.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        adminId = userService.registerAdmin(adminReq).getId();

        // Peneliti
        UserDto.UserRegistrationRequest penelitiReq = new UserDto.UserRegistrationRequest();
        penelitiReq.setName("Peneliti"); penelitiReq.setEmail("peneliti@test.com");
        penelitiReq.setNip("PNL001"); penelitiReq.setPassword("pass");
        UUID penelitiId = userService.activateUser(userService.registerUser(penelitiReq).getId()).getId();

        // Hibah
        ProgramHibahDTO hibahDto = new ProgramHibahDTO();
        hibahDto.setAdminId(adminId); hibahDto.setNamaProgram("Hibah");
        hibahDto.setBidangFokus("IT"); hibahDto.setDeskripsi("desc");
        hibahDto.setTanggalBuka(LocalDateTime.now().minusDays(1));
        hibahDto.setTanggalTutup(LocalDateTime.now().plusMonths(1));
        hibahDto.setTotalDanaMaksimal(BigDecimal.valueOf(100_000_000));
        UUID hibahId = programHibahService.createHibah(hibahDto).getId();

        // Approved Proposal
        ProposalDTO pDto = new ProposalDTO();
        pDto.setPenelitiId(penelitiId); pDto.setHibahId(hibahId);
        pDto.setJudulPenelitian("Judul"); pDto.setBidangPenelitian("IT");
        pDto.setRingkasan("Ringkasan"); pDto.setDokumenUrl("http://doc.pdf");
        pDto.setKriteriaKelengkapanDokumen(true); pDto.setKesesuaianBidang(true);
        ProposalDTO created = proposalService.createProposal(pDto);
        proposalId = proposalService.submitProposal(created.getId()).getId();
    }

    // ==================== createPencairan ====================

    @Test
    void shouldCreatePencairanWithPendingStatus() {
        PencairanDanaDTO dto = buildPencairanDto(proposalId, adminId, 1, "50000000");
        PencairanDanaDTO result = pencairanDanaService.createPencairan(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getStatusPencairan()).isEqualTo(StatusPencairan.PENDING);
        assertThat(result.getTanggalPencairan()).isNull();
        assertThat(pencairanDanaRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldAllowMultipleTahapPencairan() {
        pencairanDanaService.createPencairan(buildPencairanDto(proposalId, adminId, 1, "30000000"));
        pencairanDanaService.createPencairan(buildPencairanDto(proposalId, adminId, 2, "40000000"));
        pencairanDanaService.createPencairan(buildPencairanDto(proposalId, adminId, 3, "30000000"));

        assertThat(pencairanDanaRepository.count()).isEqualTo(3);
    }

    @Test
    void shouldThrowWhenCreatingPencairanWithNonExistentProposal() {
        PencairanDanaDTO dto = buildPencairanDto(UUID.randomUUID(), adminId, 1, "50000000");
        assertThatThrownBy(() -> pencairanDanaService.createPencairan(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    @Test
    void shouldThrowWhenCreatingPencairanWithNonExistentAdmin() {
        PencairanDanaDTO dto = buildPencairanDto(proposalId, UUID.randomUUID(), 1, "50000000");
        assertThatThrownBy(() -> pencairanDanaService.createPencairan(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    // ==================== updateStatusPencairan ====================

    @Test
    void shouldUpdateStatusFromPendingToProses() {
        PencairanDanaDTO created = pencairanDanaService.createPencairan(
                buildPencairanDto(proposalId, adminId, 1, "50000000"));

        PencairanDanaDTO updated = pencairanDanaService.updateStatusPencairan(
                created.getId(), StatusPencairan.PROSES, null);

        assertThat(updated.getStatusPencairan()).isEqualTo(StatusPencairan.PROSES);
        assertThat(updated.getTanggalPencairan()).isNull(); // Not yet disbursed
    }

    @Test
    void shouldSetTanggalPencairanWhenStatusIsCair() {
        PencairanDanaDTO created = pencairanDanaService.createPencairan(
                buildPencairanDto(proposalId, adminId, 1, "50000000"));

        PencairanDanaDTO updated = pencairanDanaService.updateStatusPencairan(
                created.getId(), StatusPencairan.CAIR, "https://bukti.transfer.pdf");

        assertThat(updated.getStatusPencairan()).isEqualTo(StatusPencairan.CAIR);
        assertThat(updated.getTanggalPencairan()).isNotNull();
        assertThat(updated.getBuktiTransferUrl()).isEqualTo("https://bukti.transfer.pdf");
    }

    @Test
    void shouldUpdateBuktiTransferUrlWithoutChangingStatus() {
        PencairanDanaDTO created = pencairanDanaService.createPencairan(
                buildPencairanDto(proposalId, adminId, 1, "50000000"));

        PencairanDanaDTO updated = pencairanDanaService.updateStatusPencairan(
                created.getId(), StatusPencairan.PROSES, "https://new-bukti.pdf");

        assertThat(updated.getBuktiTransferUrl()).isEqualTo("https://new-bukti.pdf");
        assertThat(updated.getStatusPencairan()).isEqualTo(StatusPencairan.PROSES);
    }

    @Test
    void shouldNotOverrideBuktiTransferWhenNullPassed() {
        PencairanDanaDTO dto = buildPencairanDto(proposalId, adminId, 1, "50000000");
        dto.setBuktiTransferUrl("https://existing-bukti.pdf");
        PencairanDanaDTO created = pencairanDanaService.createPencairan(dto);

        // Pass null buktiTransferUrl — should not override existing
        PencairanDanaDTO updated = pencairanDanaService.updateStatusPencairan(
                created.getId(), StatusPencairan.PROSES, null);

        assertThat(updated.getBuktiTransferUrl()).isEqualTo("https://existing-bukti.pdf");
    }

    @Test
    void shouldThrowWhenUpdatingNonExistentPencairan() {
        assertThatThrownBy(() -> pencairanDanaService.updateStatusPencairan(
                UUID.randomUUID(), StatusPencairan.CAIR, null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("PencairanDana");
    }

    // ==================== getPencairanByProposal ====================

    @Test
    void shouldGetPencairanByProposalSuccessfully() {
        pencairanDanaService.createPencairan(buildPencairanDto(proposalId, adminId, 1, "40000000"));
        pencairanDanaService.createPencairan(buildPencairanDto(proposalId, adminId, 2, "60000000"));

        List<PencairanDanaDTO> result = pencairanDanaService.getPencairanByProposal(proposalId);
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(p -> p.getProposalId().equals(proposalId));
    }

    @Test
    void shouldReturnEmptyWhenProposalHasNoPencairan() {
        List<PencairanDanaDTO> result = pencairanDanaService.getPencairanByProposal(proposalId);
        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowWhenGettingPencairanForNonExistentProposal() {
        assertThatThrownBy(() -> pencairanDanaService.getPencairanByProposal(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== helper ====================

    private PencairanDanaDTO buildPencairanDto(UUID proposalId, UUID adminId, int tahap, String jumlah) {
        PencairanDanaDTO dto = new PencairanDanaDTO();
        dto.setProposalId(proposalId);
        dto.setAdminId(adminId);
        dto.setTahapPencairan(tahap);
        dto.setJumlahDana(new BigDecimal(jumlah));
        dto.setBuktiTransferUrl(null);
        return dto;
    }
}
