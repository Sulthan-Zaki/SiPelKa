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
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId, true, true);
        ProposalDTO result = proposalService.createProposal(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getStatusProposal()).isEqualTo(StatusProposal.DRAFT);
        assertThat(proposalRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldSetDefaultFalseForCriteriaWhenNull() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId, null, null);
        ProposalDTO result = proposalService.createProposal(dto);

        assertThat(result.getKriteriaKelengkapanDokumen()).isFalse();
        assertThat(result.getKesesuaianBidang()).isFalse();
        assertThat(result.getSkorRuleBased()).isEqualTo(0);
    }

    @Test
    void shouldThrowWhenCreatingProposalWithNonExistentPeneliti() {
        ProposalDTO dto = buildProposalDto(UUID.randomUUID(), hibahId, true, true);
        assertThatThrownBy(() -> proposalService.createProposal(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    void shouldThrowWhenCreatingProposalWithNonExistentHibah() {
        ProposalDTO dto = buildProposalDto(penelitiId, UUID.randomUUID(), true, true);
        assertThatThrownBy(() -> proposalService.createProposal(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ProgramHibah");
    }

    // ==================== updateProposal ====================

    @Test
    void shouldUpdateProposalJudulSuccessfully() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, true));

        ProposalDTO updateDto = buildProposalDto(penelitiId, hibahId, true, true);
        updateDto.setJudulPenelitian("Judul Baru");
        ProposalDTO updated = proposalService.updateProposal(created.getId(), updateDto);

        assertThat(updated.getJudulPenelitian()).isEqualTo("Judul Baru");
    }

    @Test
    void shouldUpdateCriteriaPartially() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, false, false));

        ProposalDTO updateDto = buildProposalDto(penelitiId, hibahId, true, null);
        ProposalDTO updated = proposalService.updateProposal(created.getId(), updateDto);

        // kriteria updated, kesesuaian stays false (null means no-update)
        assertThat(updated.getKriteriaKelengkapanDokumen()).isTrue();
        assertThat(updated.getKesesuaianBidang()).isFalse();
    }

    @Test
    void shouldThrowWhenUpdatingNonExistentProposal() {
        ProposalDTO dto = buildProposalDto(penelitiId, hibahId, true, true);
        assertThatThrownBy(() -> proposalService.updateProposal(UUID.randomUUID(), dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== submitProposal (Rule-Based Engine) ====================

    @Test
    void shouldSetStatusUnderReviewWhenBothCriteriaTrue() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, true));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.UNDER_REVIEW);
        assertThat(submitted.getSkorRuleBased()).isEqualTo(100);
    }

    @Test
    void shouldSetStatusRuleFailedWhenKriteriaFalse() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, false, true));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.RULE_FAILED);
        assertThat(submitted.getSkorRuleBased()).isEqualTo(50);
    }

    @Test
    void shouldSetStatusRuleFailedWhenKesesuaianFalse() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, false));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.RULE_FAILED);
        assertThat(submitted.getSkorRuleBased()).isEqualTo(50);
    }

    @Test
    void shouldSetStatusRuleFailedWhenBothCriteriaFalse() {
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, false, false));
        ProposalDTO submitted = proposalService.submitProposal(created.getId());

        assertThat(submitted.getStatusProposal()).isEqualTo(StatusProposal.RULE_FAILED);
        assertThat(submitted.getSkorRuleBased()).isEqualTo(0);
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
        ProposalDTO created = proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, true));
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
        proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, true));
        proposalService.createProposal(buildProposalDto(penelitiId, hibahId, false, false));

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
        // Another peneliti
        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("Peneliti 2"); req2.setEmail("p2@test.com");
        req2.setNip("PNL002"); req2.setPassword("pass");
        UUID peneliti2Id = userService.activateUser(userService.registerUser(req2).getId()).getId();

        proposalService.createProposal(buildProposalDto(penelitiId, hibahId, true, true));
        proposalService.createProposal(buildProposalDto(peneliti2Id, hibahId, true, true));

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

    // ==================== helper ====================

    private ProposalDTO buildProposalDto(UUID penelitiId, UUID hibahId,
                                         Boolean kriteria, Boolean kesesuaian) {
        ProposalDTO dto = new ProposalDTO();
        dto.setPenelitiId(penelitiId);
        dto.setHibahId(hibahId);
        dto.setJudulPenelitian("Judul Penelitian Test");
        dto.setBidangPenelitian("Informatika");
        dto.setRingkasan("Ringkasan penelitian");
        dto.setDokumenUrl("https://storage.test/doc.pdf");
        dto.setKriteriaKelengkapanDokumen(kriteria);
        dto.setKesesuaianBidang(kesesuaian);
        return dto;
    }
}
