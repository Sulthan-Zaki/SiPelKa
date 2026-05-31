package com.sipelka.backend.service;

import com.sipelka.backend.dto.ProposalDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.ProgramHibah;
import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.StatusProposal;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.ProposalRepository;
import com.sipelka.backend.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;
    private final ProgramHibahRepository programHibahRepository;

    public ProposalService(ProposalRepository proposalRepository, UserRepository userRepository, ProgramHibahRepository programHibahRepository) {
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
        this.programHibahRepository = programHibahRepository;
    }

    @CacheEvict(value = "proposalStats", allEntries = true)
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
        proposal.setKriteriaKelengkapanDokumen(dto.getKriteriaKelengkapanDokumen() != null ? dto.getKriteriaKelengkapanDokumen() : false);
        proposal.setKesesuaianBidang(dto.getKesesuaianBidang() != null ? dto.getKesesuaianBidang() : false);
        proposal.setSkorRuleBased(0);

        return toDto(proposalRepository.save(proposal));
    }

    @CacheEvict(value = "proposalStats", allEntries = true)
    public ProposalDTO updateProposal(UUID id, ProposalDTO dto) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        proposal.setJudulPenelitian(dto.getJudulPenelitian());
        proposal.setBidangPenelitian(dto.getBidangPenelitian());
        proposal.setRingkasan(dto.getRingkasan());
        proposal.setDokumenUrl(dto.getDokumenUrl());

        if (dto.getKriteriaKelengkapanDokumen() != null) {
            proposal.setKriteriaKelengkapanDokumen(dto.getKriteriaKelengkapanDokumen());
        }
        if (dto.getKesesuaianBidang() != null) {
            proposal.setKesesuaianBidang(dto.getKesesuaianBidang());
        }

        return toDto(proposalRepository.save(proposal));
    }

    @CacheEvict(value = "proposalStats", allEntries = true)
    public ProposalDTO submitProposal(UUID id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        // Basic Rule-Based Engine
        int skor = 0;
        if (Boolean.TRUE.equals(proposal.getKriteriaKelengkapanDokumen())) {
            skor += 50;
        }
        if (Boolean.TRUE.equals(proposal.getKesesuaianBidang())) {
            skor += 50;
        }

        proposal.setSkorRuleBased(skor);

        if (skor >= 100) {
            proposal.setStatusProposal(StatusProposal.UNDER_REVIEW);
        } else {
            proposal.setStatusProposal(StatusProposal.RULE_FAILED);
        }

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
        return proposalRepository.findByPenelitiIdWithDetails(penelitiId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Newest proposals first, limited to {@code limit} rows. Lets the dashboard's
     * "Recent Submissions" widget avoid pulling the entire proposals table.
     */
    public List<ProposalDTO> getRecentProposals(int limit) {
        int size = limit > 0 ? limit : 5;
        return proposalRepository.findRecentWithDetails(PageRequest.of(0, size)).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Cacheable("proposalStats")
    public ProposalStats getStats() {
        Map<StatusProposal, Long> counts = new EnumMap<>(StatusProposal.class);
        for (Object[] row : proposalRepository.countGroupedByStatus()) {
            counts.put((StatusProposal) row[0], (Long) row[1]);
        }
        long total = counts.values().stream().mapToLong(Long::longValue).sum();
        long active = count(counts, StatusProposal.UNDER_REVIEW) + count(counts, StatusProposal.APPROVED);
        long pending = count(counts, StatusProposal.SUBMITTED) + count(counts, StatusProposal.DRAFT);
        long ruleFailed = count(counts, StatusProposal.RULE_FAILED);
        return new ProposalStats((int) total, (int) active, (int) pending, (int) ruleFailed);
    }

    private static long count(Map<StatusProposal, Long> counts, StatusProposal status) {
        return counts.getOrDefault(status, 0L);
    }

    /**
     * Proposal counts bucketed by calendar year+month over the trailing
     * {@code months} window, computed at the database level and zero-filled so the
     * series is contiguous. Replaces the frontend's name-only bucketing, which
     * collided proposals from the same month across different years.
     */
    public List<MonthlyStat> getMonthlyStats(int months) {
        int window = months > 0 ? months : 6;
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusMonths(window - 1L)
                .withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);

        Map<String, Long> byKey = new java.util.HashMap<>();
        for (Object[] row : proposalRepository.countMonthlySince(since)) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            long cnt = ((Number) row[2]).longValue();
            byKey.put(year + "-" + month, cnt);
        }

        List<MonthlyStat> result = new ArrayList<>(window);
        for (int i = window - 1; i >= 0; i--) {
            LocalDateTime d = now.minusMonths(i);
            String key = d.getYear() + "-" + d.getMonthValue();
            result.add(new MonthlyStat(d.getYear(), d.getMonthValue(), byKey.getOrDefault(key, 0L).intValue()));
        }
        return result;
    }

    public List<ProposalDTO> getFlaggedProposals() {
        return proposalRepository.findAllWithPenelitiAndHibah().stream()
                .filter(p -> p.getStatusProposal() == StatusProposal.RULE_FAILED)
                .map(this::toDto)
                .collect(Collectors.toList());
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
        dto.setKriteriaKelengkapanDokumen(proposal.getKriteriaKelengkapanDokumen());
        dto.setKesesuaianBidang(proposal.getKesesuaianBidang());
        dto.setSkorRuleBased(proposal.getSkorRuleBased());
        dto.setCreatedAt(proposal.getCreatedAt());
        dto.setUpdatedAt(proposal.getUpdatedAt());
        return dto;
    }

    public record ProposalStats(int total, int active, int pending, int ruleFailed) {}

    public record MonthlyStat(int year, int month, int count) {}
}
