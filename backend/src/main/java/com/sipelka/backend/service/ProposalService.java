package com.sipelka.backend.service;

import com.sipelka.backend.dto.LogbookPenelitianDTO;
import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.LogbookPenelitian;
import com.sipelka.backend.model.ProgramHibah;
import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.StatusProposal;
import com.sipelka.backend.repository.LogbookPenelitianRepository;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.ProposalRepository;
import com.sipelka.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;
    private final ProgramHibahRepository programHibahRepository;
    private final LogbookPenelitianRepository logbookPenelitianRepository;
    private final RuleBasedScreeningService ruleBasedScreeningService;

    public ProposalService(ProposalRepository proposalRepository, UserRepository userRepository, ProgramHibahRepository programHibahRepository, LogbookPenelitianRepository logbookPenelitianRepository, RuleBasedScreeningService ruleBasedScreeningService) {
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
        this.programHibahRepository = programHibahRepository;
        this.logbookPenelitianRepository = logbookPenelitianRepository;
        this.ruleBasedScreeningService = ruleBasedScreeningService;
    }

    public ProposalDTO createProposal(ProposalDTO dto) {
        User peneliti = userRepository.findById(dto.getPenelitiId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getPenelitiId()));
        ProgramHibah hibah = programHibahRepository.findById(dto.getHibahId())
                .orElseThrow(() -> new ResourceNotFoundException("ProgramHibah", "id", dto.getHibahId()));

        Proposal proposal = new Proposal();
        proposal.setPeneliti(peneliti);
        proposal.setHibah(hibah);
        proposal.setJudulPenelitian(dto.getJudulPenelitian());
        proposal.setBidangPenelitian(dto.getBidangPenelitian());
        proposal.setRingkasan(dto.getRingkasan());
        proposal.setDokumenUrl(dto.getDokumenUrl());
        proposal.setStatusProposal(StatusProposal.DRAFT);
        proposal.setSkorRuleBased(0);

        return toDto(proposalRepository.save(proposal));
    }

    public ProposalDTO updateProposal(UUID id, ProposalDTO dto) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        proposal.setJudulPenelitian(dto.getJudulPenelitian());
        proposal.setBidangPenelitian(dto.getBidangPenelitian());
        proposal.setRingkasan(dto.getRingkasan());
        proposal.setDokumenUrl(dto.getDokumenUrl());

        return toDto(proposalRepository.save(proposal));
    }

    public ProposalDTO submitProposal(UUID id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        int skor = ruleBasedScreeningService.calculateScore(proposal);
        proposal.setSkorRuleBased(skor);
        proposal.setStatusProposal(StatusProposal.UNDER_REVIEW);

        return toDto(proposalRepository.save(proposal));
    }

    public ProposalDTO getProposalById(UUID id) {
        return proposalRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));
    }

    public List<ProposalDTO> getAllProposals() {
        return proposalRepository.findAllWithPenelitiAndHibah().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProposalDTO> getProposalsByPeneliti(UUID penelitiId) {
        if (!userRepository.existsById(penelitiId)) {
            throw new ResourceNotFoundException("User", "id", penelitiId);
        }
        return proposalRepository.findAll().stream()
                .filter(p -> p.getPeneliti().getId().equals(penelitiId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProposalStats getStats() {
        List<Proposal> all = proposalRepository.findAllWithPenelitiAndHibah();
        int total = all.size();
        int active = (int) all.stream().filter(p -> p.getStatusProposal() == StatusProposal.UNDER_REVIEW || p.getStatusProposal() == StatusProposal.APPROVED).count();
        int pending = (int) all.stream().filter(p -> p.getStatusProposal() == StatusProposal.SUBMITTED || p.getStatusProposal() == StatusProposal.DRAFT).count();
        return new ProposalStats(total, active, pending);
    }

    public List<ProposalDTO> getFlaggedProposals() {
        return proposalRepository.findAllWithPenelitiAndHibah().stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.UNDER_REVIEW)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProposalDTO updateStatus(UUID id, String status) {
        Proposal proposal = proposalRepository.findByIdWithPenelitiAndHibah(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        proposal.setStatusProposal(StatusProposal.valueOf(status));
        return toDto(proposalRepository.save(proposal));
    }

    public void deleteProposal(UUID id) {
        if (!proposalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Proposal", "id", id);
        }
        proposalRepository.deleteById(id);
    }

    public PenelitiStats getStatsByPeneliti(UUID penelitiId) {
        if (!userRepository.existsById(penelitiId)) {
            throw new ResourceNotFoundException("User", "id", penelitiId);
        }

        List<Proposal> proposals = proposalRepository.findAll().stream()
                .filter(p -> p.getPeneliti().getId().equals(penelitiId))
                .collect(Collectors.toList());

        long activeGrants = proposals.stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.APPROVED)
                .count();
        long totalProposals = proposals.size();
        long draftProposals = proposals.stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.DRAFT)
                .count();
        long submittedProposals = proposals.stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.SUBMITTED)
                .count();
        long approvedProposals = proposals.stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.APPROVED)
                .count();
        long rejectedProposals = proposals.stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.REJECTED)
                .count();

        List<UUID> proposalIds = proposals.stream()
                .map(Proposal::getId)
                .collect(Collectors.toList());

        List<LogbookPenelitianDTO> recentLogbooks = new ArrayList<>();
        if (!proposalIds.isEmpty()) {
            recentLogbooks = logbookPenelitianRepository
                    .findByProposalIdInOrderByCreatedAtDesc(proposalIds)
                    .stream()
                    .limit(5)
                    .map(this::toLogbookDto)
                    .collect(Collectors.toList());
        }

        List<DeadlineDTO> upcomingDeadlines = proposals.stream()
                .map(p -> {
                    LocalDateTime deadline = p.getHibah().getTanggalTutup();
                    LocalDate deadlineDate = deadline.toLocalDate();
                    boolean isUrgent = deadlineDate.isBefore(LocalDate.now().plusDays(7));
                    return new DeadlineDTO(
                            "Batas akhir pengajuan proposal",
                            p.getHibah().getNamaProgram(),
                            deadlineDate,
                            isUrgent
                    );
                })
                .collect(Collectors.toList());

        return new PenelitiStats(activeGrants, totalProposals, draftProposals, submittedProposals, approvedProposals, rejectedProposals, recentLogbooks, upcomingDeadlines);
    }

    private ProposalDTO toDto(Proposal proposal) {
        ProposalDTO dto = new ProposalDTO();
        dto.setId(proposal.getId());
        dto.setPenelitiId(proposal.getPeneliti().getId());
        dto.setPenelitiName(proposal.getPeneliti().getName());
        dto.setHibahId(proposal.getHibah().getId());
        dto.setHibahName(proposal.getHibah().getNamaProgram());
        dto.setJudulPenelitian(proposal.getJudulPenelitian());
        dto.setBidangPenelitian(proposal.getBidangPenelitian());
        dto.setRingkasan(proposal.getRingkasan());
        dto.setDokumenUrl(proposal.getDokumenUrl());
        dto.setStatusProposal(proposal.getStatusProposal());
        dto.setSkorRuleBased(proposal.getSkorRuleBased());
        dto.setCreatedAt(proposal.getCreatedAt());
        dto.setUpdatedAt(proposal.getUpdatedAt());
        return dto;
    }

    private LogbookPenelitianDTO toLogbookDto(LogbookPenelitian logbook) {
        LogbookPenelitianDTO dto = new LogbookPenelitianDTO();
        dto.setId(logbook.getId());
        dto.setProposalId(logbook.getProposal().getId());
        dto.setTanggalKegiatan(logbook.getTanggalKegiatan());
        dto.setDeskripsiProgress(logbook.getDeskripsiProgress());
        dto.setKendala(logbook.getKendala());
        dto.setLampiranUrl(logbook.getLampiranUrl());
        dto.setCreatedAt(logbook.getCreatedAt());
        return dto;
    }

    public record ProposalStats(int total, int active, int pending) {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PenelitiStats {
        private long activeGrants;
        private long totalProposals;
        private long draftProposals;
        private long submittedProposals;
        private long approvedProposals;
        private long rejectedProposals;
        private List<LogbookPenelitianDTO> recentLogbooks;
        private List<DeadlineDTO> upcomingDeadlines;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeadlineDTO {
        private String task;
        private String grantName;
        private LocalDate deadline;
        private boolean isUrgent;
    }
}
