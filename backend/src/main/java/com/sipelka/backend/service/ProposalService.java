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
import org.springframework.stereotype.Service;

import java.util.List;
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
        return proposalRepository.findAll().stream()
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

    private ProposalDTO toDto(Proposal proposal) {
        ProposalDTO dto = new ProposalDTO();
        dto.setId(proposal.getId());
        dto.setPenelitiId(proposal.getPeneliti().getId());
        dto.setHibahId(proposal.getHibah().getId());
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
}
