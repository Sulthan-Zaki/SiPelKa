package com.sipelka.backend.service;

import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.LogbookPenelitian;
import com.sipelka.backend.model.enums.StatusProposal;
import com.sipelka.backend.model.enums.UserRole;
import com.sipelka.backend.repository.LogbookPenelitianRepository;
import com.sipelka.backend.repository.ProposalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RuleBasedScreeningService {

    private static final int MAX_ACTIVE_GRANTS = 6;
    private static final int MIN_JUDUL_LENGTH = 10;
    private static final int MIN_RINGKASAN_LENGTH = 100;
    private static final int LOGBOOK_MAX_GAP_DAYS = 7;

    private final ProposalRepository proposalRepository;
    private final LogbookPenelitianRepository logbookRepository;

    public RuleBasedScreeningService(ProposalRepository proposalRepository,
                                     LogbookPenelitianRepository logbookRepository) {
        this.proposalRepository = proposalRepository;
        this.logbookRepository = logbookRepository;
    }

    public int calculateScore(Proposal proposal) {
        int score = 0;
        score += checkDocumentCompleteness(proposal);
        score += checkResearcherEligibility(proposal);
        score += checkPastPerformance(proposal);
        score += checkActiveGrantLimit(proposal);
        return score;
    }

    private int checkDocumentCompleteness(Proposal proposal) {
        int score = 0;

        if (proposal.getDokumenUrl() != null && !proposal.getDokumenUrl().isBlank()) {
            score += 10;
        }

        if (proposal.getRingkasan() != null && proposal.getRingkasan().length() >= MIN_RINGKASAN_LENGTH) {
            score += 10;
        }

        if (proposal.getJudulPenelitian() != null && proposal.getJudulPenelitian().length() >= MIN_JUDUL_LENGTH) {
            score += 10;
        }

        return score;
    }

    private int checkResearcherEligibility(Proposal proposal) {
        int score = 0;

        if (proposal.getPeneliti() == null) {
            return 0;
        }

        if (proposal.getPeneliti().isActivated()) {
            score += 20;
        }

        if (proposal.getPeneliti().getRole() == UserRole.RESEARCHER) {
            score += 15;
        }

        return score;
    }

    private int checkPastPerformance(Proposal proposal) {
        if (proposal.getPeneliti() == null) {
            return 0;
        }

        UUID penelitiId = proposal.getPeneliti().getId();

        List<Proposal> approvedProposals = proposalRepository
                .findByPenelitiIdAndStatusProposal(penelitiId, StatusProposal.APPROVED);

        if (approvedProposals.isEmpty()) {
            return 20;
        }

        List<UUID> approvedProposalIds = approvedProposals.stream()
                .map(Proposal::getId)
                .collect(Collectors.toList());

        List<LogbookPenelitian> allLogbooks = logbookRepository.findByProposalIdIn(approvedProposalIds);

        if (allLogbooks.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        boolean hasOverdue = approvedProposalIds.stream().anyMatch(proposalId -> {
            List<LogbookPenelitian> logbooks = allLogbooks.stream()
                    .filter(lb -> lb.getProposal().getId().equals(proposalId))
                    .collect(Collectors.toList());

            if (logbooks.isEmpty()) {
                return true;
            }

            LocalDate latestDate = logbooks.stream()
                    .map(LogbookPenelitian::getTanggalKegiatan)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            if (latestDate == null) {
                return true;
            }

            long daysSinceLastEntry = ChronoUnit.DAYS.between(latestDate, today);
            return daysSinceLastEntry > LOGBOOK_MAX_GAP_DAYS;
        });

        return hasOverdue ? 0 : 20;
    }

    private int checkActiveGrantLimit(Proposal proposal) {
        if (proposal.getPeneliti() == null) {
            return 0;
        }

        UUID penelitiId = proposal.getPeneliti().getId();
        long activeCount = proposalRepository
                .countByPenelitiIdAndStatusProposal(penelitiId, StatusProposal.APPROVED);

        return activeCount < MAX_ACTIVE_GRANTS ? 15 : 0;
    }
}
