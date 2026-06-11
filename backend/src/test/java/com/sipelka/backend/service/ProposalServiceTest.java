package com.sipelka.backend.service;

import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.enums.StatusProposal;
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
public class ProposalServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private ProposalService proposalService;
    @Autowired private ProgramHibahService programHibahService;
    @Autowired private UserService userService;
    @Autowired private ProposalRepository proposalRepository;
    @Autowired private ProgramHibahRepository programHibahRepository;
    @Autowired private UserRepository userRepository;

    private UUID adminId;
    private UUID penelitiId;
    private UUID hibahId;

    @BeforeEach
    void setUp() {
        proposalRepository.deleteAll();
        programHibahRepository.deleteAll();
        userRepository.deleteAll();

        UserDto.AdminRegistrationRequest adminReq = new UserDto.AdminRegistrationRequest();
        adminReq.setName("Admin"); adminReq.setEmail("admin@test.com");
        adminReq.setNip("ADM001"); adminReq.setPassword("pass");
        adminReq.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        adminId = userService.registerAdmin(adminReq).getId();

        UserDto.UserRegistrationRequest penelitiReq = new UserDto.UserRegistrationRequest();
        penelitiReq.setName("Peneliti"); penelitiReq.setEmail("peneliti@test.com");
        penelitiReq.setNip("PNL001"); penelitiReq.setPassword("pass");
        UserDto.Response penelitiRes = userService.registerUser(penelitiReq);
        penelitiId = userService.activateUser(penelitiRes.getId()).getId();

        ProgramHibahDTO hibahDto = new ProgramHibahDTO();
        hibahDto.setAdminId(adminId); hibahDto.setNamaProgram("Hibah Test");
        hibahDto.setBidangFokus("IT"); hibahDto.setDeskripsi("desc");
        hibahDto.setTanggalBuka(LocalDateTime.now().minusDays(1));
        hibahDto.setTanggalTutup(LocalDateTime.now().plusMonths(1));
        hibahDto.setTotalDanaMaksimal(BigDecimal.valueOf(100_000_000));
        hibahId = programHibahService.createHibah(hibahDto).getId();
    }

    // ==================== createProposal ====================

    @Test
    void shouldCreateProposalWithDraftStatus() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId);
        ProposalDTO result = proposalService.createProposal(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getStatusProposal()).isEqualTo(StatusProposal.DRAFT);
        assertThat(result.getSkorRuleBased()).isEqualTo(0);
        assertThat(proposalRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldThrowWhenCreatingProposalWithNonExistentPeneliti() {
        ProposalDTO dto = buildProposalDto(UUID.randomUUID(), hibahId);
        assertThatThrownBy(() -> proposalService.createProposal(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    void shouldThrowWhenCreatingProposalWithNonExistentHibah() {
        ProposalDTO dto = buildProposalDto(penelitiId, UUID.randomUUID());
        assertThatThrownBy(() -> proposalService.createProposal(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ProgramHibah");
    }

    // ==================== updateProposal ====================

    @Test
    void shouldUpdateProposalJudulSuccessfully() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));

        ProposalDTO updateDto = buildProposalDto(penelitiId, hibahId);
        updateDto.setJudulPenelitian("Judul Baru");
        ProposalDTO updated = proposalService.updateProposal(created.getId(), updateDto);

        assertThat(updated.getJudulPenelitian()).isEqualTo("Judul Baru");
    }

    @Test
    void shouldThrowWhenUpdatingNonExistentProposal() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId);
        assertThatThrownBy(() -> proposalService.updateProposal(UUID.randomUUID(), dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== submitProposal (Rule-Based Engine) ====================

    @Test
    void shouldAlwaysSetStatusUnderReviewOnSubmit() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.UNDER_REVIEW);
    }

    @Test
    void shouldCalculateScoreOnSubmit() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getSkorRuleBased()).isNotNull();
        assertThat(submitted.getSkorRuleBased()).isGreaterThanOrEqualTo(0);
        assertThat(submitted.getSkorRuleBased()).isLessThanOrEqualTo(100);
    }

    @Test
    void shouldGiveFullScoreForCompleteProposal() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId);
        dto.setJudulPenelitian("Judul Penelitian yang Cukup Panjang");
        dto.setRingkasan("Ringkasan penelitian yang cukup panjang untuk memenuhi kriteria minimum seratus karakter. Ini adalah ringkasan yang lengkap dan detail.");
        dto.setDokumenUrl("https://storage.test/doc.pdf");
        ProposalDTO created = proposalService.createProposal(dto);
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getSkorRuleBased()).isEqualTo(100);
    }

    @Test
    void shouldGivePartialScoreForShortJudul() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId);
        dto.setJudulPenelitian("Pendek");
        dto.setRingkasan("Ringkasan pendek");
        dto.setDokumenUrl("https://storage.test/doc.pdf");
        ProposalDTO created = proposalService.createProposal(dto);
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getSkorRuleBased()).isLessThan(100);
        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.UNDER_REVIEW);
    }

    @Test
    void shouldThrowWhenSubmittingNonExistentProposal() {
        assertThatThrownBy(() -> proposalService.submitProposal(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== getProposalById ====================

    @Test
    void shouldGetProposalByIdSuccessfully() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        ProposalDTO found = proposalService.getProposalById(created.getId());

        assertThat(found.getJudulPenelitian()).isEqualTo("Judul Penelitian Test");
    }

    @Test
    void shouldThrowWhenGettingNonExistentProposalById() {
        assertThatThrownBy(() -> proposalService.getProposalById(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== getAllProposals ====================

    @Test
    void shouldReturnAllProposals() {
        proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        proposalService.createProposal(buildProposalDto(penelitiId, hibahId));

        List<ProposalDTO> all = proposalService.getAllProposals();
        assertThat(all).hasSize(2);
    }

    @Test
    void shouldReturnEmptyListWhenNoProposals() {
        assertThat(proposalService.getAllProposals()).isEmpty();
    }

    // ==================== getProposalsByPeneliti ====================

    @Test
    void shouldGetProposalsBySpecificPeneliti() {
        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("Peneliti 2"); req2.setEmail("p2@test.com");
        req2.setNip("PNL002"); req2.setPassword("pass");
        UUID peneliti2Id = userService.activateUser(userService.registerUser(req2).getId()).getId();

        proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        proposalService.createProposal(buildProposalDto(peneliti2Id, hibahId));

        List<ProposalDTO> result = proposalService.getProposalsByPeneliti(penelitiId);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPenelitiId()).isEqualTo(penelitiId);
    }

    @Test
    void shouldThrowWhenGettingProposalsByNonExistentPeneliti() {
        assertThatThrownBy(() -> proposalService.getProposalsByPeneliti(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    // ==================== getFlaggedProposals ====================

    @Test
    void shouldReturnUnderReviewProposalsAsFlagged() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        proposalService.submitProposal(created.getId());

        List<ProposalDTO> flagged = proposalService.getFlaggedProposals();
        assertThat(flagged).hasSize(1);
        assertThat(flagged.get(0).getStatusProposal()).isEqualTo(StatusProposal.UNDER_REVIEW);
    }

    @Test
    void shouldNotReturnDraftProposalsAsFlagged() {
        proposalService.createProposal(buildProposalDto(penelitiId, hibahId));

        List<ProposalDTO> flagged = proposalService.getFlaggedProposals();
        assertThat(flagged).isEmpty();
    }

    // ==================== getStats ====================

    @Test
    void shouldReturnCorrectStats() {
        ProposalDTO p1 = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        ProposalDTO p2 = proposalService.createProposal(buildProposalDto(penelitiId, hibahId));
        proposalService.submitProposal(p1.getId());

        ProposalService.ProposalStats stats = proposalService.getStats();
        assertThat(stats.total()).isEqualTo(2);
        assertThat(stats.active()).isEqualTo(1);
        assertThat(stats.pending()).isEqualTo(1);
    }

    // ==================== helper ====================

    private ProposalDTO buildProposalDto(UUID penelitiId, UUID hibahId) {
        ProposalDTO dto = new ProposalDTO();
        dto.setPenelitiId(penelitiId);
        dto.setHibahId(hibahId);
        dto.setJudulPenelitian("Judul Penelitian Test");
        dto.setBidangPenelitian("Informatika");
        dto.setRingkasan("Ringkasan penelitian");
        dto.setDokumenUrl("https://storage.test/doc.pdf");
        return dto;
    }
}
