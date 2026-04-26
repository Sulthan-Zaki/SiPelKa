package com.sipelka.backend.service;

import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.dto.ReviewProposalDTO;
import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.enums.StatusProposal;
import com.sipelka.backend.model.enums.StatusRekomendasi;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.ProposalRepository;
import com.sipelka.backend.repository.ReviewProposalRepository;
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
public class ReviewProposalServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired private ReviewProposalService reviewProposalService;
    @Autowired private ProposalService proposalService;
    @Autowired private ProgramHibahService programHibahService;
    @Autowired private UserService userService;
    @Autowired private ReviewProposalRepository reviewProposalRepository;
    @Autowired private ProposalRepository proposalRepository;
    @Autowired private ProgramHibahRepository programHibahRepository;
    @Autowired private UserRepository userRepository;

    private UUID reviewerId;
    private UUID proposalId;

    @BeforeEach
    void setUp() {
        reviewProposalRepository.deleteAll();
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

        // Reviewer
        UserDto.UserRegistrationRequest reviewerReq = new UserDto.UserRegistrationRequest();
        reviewerReq.setName("Reviewer"); reviewerReq.setEmail("reviewer@test.com");
        reviewerReq.setNip("RVW001"); reviewerReq.setPassword("pass");
        reviewerId = userService.activateUser(userService.registerUser(reviewerReq).getId()).getId();

        // Hibah
        ProgramHibahDTO hibahDto = new ProgramHibahDTO();
        hibahDto.setAdminId(adminId); hibahDto.setNamaProgram("Hibah");
        hibahDto.setBidangFokus("IT"); hibahDto.setDeskripsi("desc");
        hibahDto.setTanggalBuka(LocalDateTime.now().minusDays(1));
        hibahDto.setTanggalTutup(LocalDateTime.now().plusMonths(1));
        hibahDto.setTotalDanaMaksimal(BigDecimal.valueOf(100_000_000));
        UUID hibahId = programHibahService.createHibah(hibahDto).getId();

        // Proposal - submitted & under review
        ProposalDTO pDto = new ProposalDTO();
        pDto.setPenelitiId(penelitiId); pDto.setHibahId(hibahId);
        pDto.setJudulPenelitian("Judul Test"); pDto.setBidangPenelitian("IT");
        pDto.setRingkasan("Ringkasan"); pDto.setDokumenUrl("http://doc.pdf");
        pDto.setKriteriaKelengkapanDokumen(true); pDto.setKesesuaianBidang(true);
        ProposalDTO created = proposalService.createProposal(pDto);
        proposalId = proposalService.submitProposal(created.getId()).getId();
    }

    // ==================== assignReviewer ====================

    @Test
    void shouldAssignReviewerSuccessfully() {
        ReviewProposalDTO result = reviewProposalService.assignReviewer(proposalId, reviewerId);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getProposalId()).isEqualTo(proposalId);
        assertThat(result.getReviewerId()).isEqualTo(reviewerId);
        assertThat(result.getSkorPenilaian()).isEqualTo(0);
        assertThat(reviewProposalRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldThrowWhenAssigningReviewerWithNonExistentProposal() {
        assertThatThrownBy(() -> reviewProposalService.assignReviewer(UUID.randomUUID(), reviewerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    @Test
    void shouldThrowWhenAssigningNonExistentReviewer() {
        assertThatThrownBy(() -> reviewProposalService.assignReviewer(proposalId, UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    void shouldAllowMultipleReviewersOnSameProposal() {
        // Second reviewer
        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("Reviewer 2"); req2.setEmail("rv2@test.com");
        req2.setNip("RVW002"); req2.setPassword("pass");
        UUID reviewer2Id = userService.activateUser(userService.registerUser(req2).getId()).getId();

        reviewProposalService.assignReviewer(proposalId, reviewerId);
        reviewProposalService.assignReviewer(proposalId, reviewer2Id);

        assertThat(reviewProposalRepository.count()).isEqualTo(2);
    }

    // ==================== submitReview ====================

    @Test
    void shouldSubmitReviewLayakAndSetProposalApproved() {
        ReviewProposalDTO assigned = reviewProposalService.assignReviewer(proposalId, reviewerId);

        ReviewProposalDTO reviewDto = new ReviewProposalDTO();
        reviewDto.setSkorPenilaian(90);
        reviewDto.setCatatanRevisi("Proposal sangat baik");
        reviewDto.setStatusRekomendasi(StatusRekomendasi.LAYAK);

        ReviewProposalDTO result = reviewProposalService.submitReview(assigned.getId(), reviewDto);

        assertThat(result.getStatusRekomendasi()).isEqualTo(StatusRekomendasi.LAYAK);
        assertThat(result.getSkorPenilaian()).isEqualTo(90);

        // Proposal status should change to APPROVED
        ProposalDTO proposal = proposalService.getProposalById(proposalId);
        assertThat(proposal.getStatusProposal()).isEqualTo(StatusProposal.APPROVED);
    }

    @Test
    void shouldSubmitReviewTidakLayakAndSetProposalRejected() {
        ReviewProposalDTO assigned = reviewProposalService.assignReviewer(proposalId, reviewerId);

        ReviewProposalDTO reviewDto = new ReviewProposalDTO();
        reviewDto.setSkorPenilaian(30);
        reviewDto.setCatatanRevisi("Tidak memenuhi syarat");
        reviewDto.setStatusRekomendasi(StatusRekomendasi.TIDAK_LAYAK);

        reviewProposalService.submitReview(assigned.getId(), reviewDto);

        ProposalDTO proposal = proposalService.getProposalById(proposalId);
        assertThat(proposal.getStatusProposal()).isEqualTo(StatusProposal.REJECTED);
    }

    @Test
    void shouldSubmitReviewRevisiAndSetProposalRejected() {
        ReviewProposalDTO assigned = reviewProposalService.assignReviewer(proposalId, reviewerId);

        ReviewProposalDTO reviewDto = new ReviewProposalDTO();
        reviewDto.setSkorPenilaian(60);
        reviewDto.setCatatanRevisi("Perlu revisi metodologi");
        reviewDto.setStatusRekomendasi(StatusRekomendasi.REVISI);

        reviewProposalService.submitReview(assigned.getId(), reviewDto);

        ProposalDTO proposal = proposalService.getProposalById(proposalId);
        assertThat(proposal.getStatusProposal()).isEqualTo(StatusProposal.REJECTED);
    }

    @Test
    void shouldThrowWhenSubmittingReviewWithNonExistentReviewId() {
        ReviewProposalDTO reviewDto = new ReviewProposalDTO();
        reviewDto.setSkorPenilaian(80);
        reviewDto.setStatusRekomendasi(StatusRekomendasi.LAYAK);

        assertThatThrownBy(() -> reviewProposalService.submitReview(UUID.randomUUID(), reviewDto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ReviewProposal");
    }

    // ==================== getReviewsByProposal ====================

    @Test
    void shouldGetReviewsByProposalSuccessfully() {
        reviewProposalService.assignReviewer(proposalId, reviewerId);

        List<ReviewProposalDTO> reviews = reviewProposalService.getReviewsByProposal(proposalId);
        assertThat(reviews).hasSize(1);
        assertThat(reviews.get(0).getProposalId()).isEqualTo(proposalId);
    }

    @Test
    void shouldReturnEmptyWhenNoReviewsForProposal() {
        List<ReviewProposalDTO> reviews = reviewProposalService.getReviewsByProposal(proposalId);
        assertThat(reviews).isEmpty();
    }

    @Test
    void shouldThrowWhenGettingReviewsByNonExistentProposal() {
        assertThatThrownBy(() -> reviewProposalService.getReviewsByProposal(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Proposal");
    }

    // ==================== getReviewsByReviewer ====================

    @Test
    void shouldGetReviewsByReviewerSuccessfully() {
        reviewProposalService.assignReviewer(proposalId, reviewerId);

        List<ReviewProposalDTO> reviews = reviewProposalService.getReviewsByReviewer(reviewerId);
        assertThat(reviews).hasSize(1);
        assertThat(reviews.get(0).getReviewerId()).isEqualTo(reviewerId);
    }

    @Test
    void shouldReturnEmptyWhenReviewerHasNoReviews() {
        // Create another reviewer but don't assign
        UserDto.UserRegistrationRequest req = new UserDto.UserRegistrationRequest();
        req.setName("Idle Reviewer"); req.setEmail("idle@test.com");
        req.setNip("IDLE001"); req.setPassword("pass");
        UUID idleReviewerId = userService.activateUser(userService.registerUser(req).getId()).getId();

        List<ReviewProposalDTO> reviews = reviewProposalService.getReviewsByReviewer(idleReviewerId);
        assertThat(reviews).isEmpty();
    }

    @Test
    void shouldThrowWhenGettingReviewsByNonExistentReviewer() {
        assertThatThrownBy(() -> reviewProposalService.getReviewsByReviewer(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }
}
