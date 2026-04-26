package com.sipelka.backend.service;

import com.sipelka.backend.dto.LogbookPenelitianDTO;
import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.repository.LogbookPenelitianRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
public class LogbookPenelitianServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private LogbookPenelitianService logbookPenelitianService;
    @Autowired private ProposalService proposalService;
    @Autowired private ProgramHibahService programHibahService;
    @Autowired private UserService userService;
    @Autowired private LogbookPenelitianRepository logbookPenelitianRepository;
    @Autowired private ProposalRepository proposalRepository;
    @Autowired private ProgramHibahRepository programHibahRepository;
    @Autowired private UserRepository userRepository;

    private UUID proposalId;
    private UUID proposal2Id;

    @BeforeEach
    void setUp() {
        logbookPenelitianRepository.deleteAll();
        proposalRepository.deleteAll();
        programHibahRepository.deleteAll();
        userRepository.deleteAll();

        // Admin
        UserDto.AdminRegistrationRequest adminReq = new UserDto.AdminRegistrationRequest();
        adminReq.setName("Admin"); adminReq.setEmail("admin@test.com");
        adminReq.setNip("ADM001"); adminReq.setPassword("pass");
        adminReq.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        UUID adminId = userService.registerAdmin(adminReq).getId();

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

        // Proposal 1
        ProposalDTO p1 = buildProposalDto(penelitiId, hibahId);
        proposalId = proposalService.submitProposal(proposalService.createProposal(p1).getId()).getId();

        // Proposal 2 (for isolation tests)
        ProposalDTO p2 = buildProposalDto(penelitiId, hibahId);
        proposal2Id = proposalService.submitProposal(proposalService.createProposal(p2).getId()).getId();
    }

    // ==================== createLogbook ====================

    @Test
    void shouldCreateLogbookSuccessfully() {
        LogbookPenelitianDTO dto = buildLogbookDto(proposalId, LocalDate.now(), "Progress hari ini");
        LogbookPenelitianDTO result = logbookPenelitianService.createLogbook(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getProposalId()).isEqualTo(proposalId);
        assertThat(result.getDeskripsiProgress()).isEqualTo("Progress hari ini");
        assertThat(logbookPenelitianRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldCreateMultipleLogbooksForSameProposal() {
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now().minusDays(2), "Hari 1"));
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now().minusDays(1), "Hari 2"));
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now(), "Hari 3"));

        assertThat(logbookPenelitianRepository.count()).isEqualTo(3);
        List<LogbookPenelitianDTO> result = logbookPenelitianService.getLogbooksByProposal(proposalId);
        assertThat(result).hasSize(3);
    }

    @Test
    void shouldSaveKendalaFieldCorrectly() {
        LogbookPenelitianDTO dto = buildLogbookDto(proposalId, LocalDate.now(), "Progress");
        dto.setKendala("Server down hari ini");
        LogbookPenelitianDTO result = logbookPenelitianService.createLogbook(dto);

        assertThat(result.getKendala()).isEqualTo("Server down hari ini");
    }

    @Test
    void shouldSaveLampiranUrlCorrectly() {
        LogbookPenelitianDTO dto = buildLogbookDto(proposalId, LocalDate.now(), "Progress");
        dto.setLampiranUrl("https://storage.test/lampiran.pdf");
        LogbookPenelitianDTO result = logbookPenelitianService.createLogbook(dto);

        assertThat(result.getLampiranUrl()).isEqualTo("https://storage.test/lampiran.pdf");
    }

    @Test
    void shouldCreateLogbookWithNullKendalaAndLampiran() {
        LogbookPenelitianDTO dto = buildLogbookDto(proposalId, LocalDate.now(), "Progress");
        dto.setKendala(null);
        dto.setLampiranUrl(null);

        LogbookPenelitianDTO result = logbookPenelitianService.createLogbook(dto);
        assertThat(result.getKendala()).isNull();
        assertThat(result.getLampiranUrl()).isNull();
    }

    @Test
    void shouldThrowWhenCreatingLogbookWithNonExistentProposal() {
        LogbookPenelitianDTO dto = buildLogbookDto(UUID.randomUUID(), LocalDate.now(), "Progress");
        assertThatThrownBy(() -> logbookPenelitianService.createLogbook(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== getLogbooksByProposal ====================

    @Test
    void shouldGetLogbooksByProposalSuccessfully() {
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now(), "Progress A"));
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now().minusDays(1), "Progress B"));

        List<LogbookPenelitianDTO> result = logbookPenelitianService.getLogbooksByProposal(proposalId);
        assertThat(result).hasSize(2);
    }

    @Test
    void shouldReturnOnlyLogbooksForRequestedProposal() {
        // Add logbooks for both proposals
        logbookPenelitianService.createLogbook(buildLogbookDto(proposalId, LocalDate.now(), "Proposal 1 Progress"));
        logbookPenelitianService.createLogbook(buildLogbookDto(proposal2Id, LocalDate.now(), "Proposal 2 Progress"));

        List<LogbookPenelitianDTO> result = logbookPenelitianService.getLogbooksByProposal(proposalId);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDeskripsiProgress()).isEqualTo("Proposal 1 Progress");
    }

    @Test
    void shouldReturnEmptyWhenProposalHasNoLogbooks() {
        List<LogbookPenelitianDTO> result = logbookPenelitianService.getLogbooksByProposal(proposalId);
        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowWhenGettingLogbooksForNonExistentProposal() {
        assertThatThrownBy(() -> logbookPenelitianService.getLogbooksByProposal(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    @Test
    void shouldPreserveTanggalKegiatanCorrectly() {
        LocalDate tanggal = LocalDate.of(2025, 6, 15);
        LogbookPenelitianDTO dto = buildLogbookDto(proposalId, tanggal, "Kegiatan khusus");
        LogbookPenelitianDTO result = logbookPenelitianService.createLogbook(dto);

        assertThat(result.getTanggalKegiatan()).isEqualTo(tanggal);
    }

    // ==================== helper ====================

    private ProposalDTO buildProposalDto(UUID penelitiId, UUID hibahId) {
        ProposalDTO dto = new ProposalDTO();
        dto.setPenelitiId(penelitiId); dto.setHibahId(hibahId);
        dto.setJudulPenelitian("Judul Test"); dto.setBidangPenelitian("IT");
        dto.setRingkasan("Ringkasan"); dto.setDokumenUrl("http://doc.pdf");
        dto.setKriteriaKelengkapanDokumen(true); dto.setKesesuaianBidang(true);
        return dto;
    }

    private LogbookPenelitianDTO buildLogbookDto(UUID proposalId, LocalDate tanggal, String progress) {
        LogbookPenelitianDTO dto = new LogbookPenelitianDTO();
        dto.setProposalId(proposalId);
        dto.setTanggalKegiatan(tanggal);
        dto.setDeskripsiProgress(progress);
        return dto;
    }
}
