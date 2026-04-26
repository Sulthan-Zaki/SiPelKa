package com.sipelka.backend.service;

import com.sipelka.backend.dto.LogbookPenelitianDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.LogbookPenelitian;
import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.repository.LogbookPenelitianRepository;
import com.sipelka.backend.repository.ProposalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LogbookPenelitianService {

    private final LogbookPenelitianRepository logbookPenelitianRepository;
    private final ProposalRepository proposalRepository;

    public LogbookPenelitianService(LogbookPenelitianRepository logbookPenelitianRepository, ProposalRepository proposalRepository) {
        this.logbookPenelitianRepository = logbookPenelitianRepository;
        this.proposalRepository = proposalRepository;
    }

    public LogbookPenelitianDTO createLogbook(LogbookPenelitianDTO dto) {
        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", dto.getProposalId()));

        LogbookPenelitian logbook = new LogbookPenelitian();
        logbook.setProposal(proposal);
        logbook.setTanggalKegiatan(dto.getTanggalKegiatan());
        logbook.setDeskripsiProgress(dto.getDeskripsiProgress());
        logbook.setKendala(dto.getKendala());
        logbook.setLampiranUrl(dto.getLampiranUrl());

        return toDto(logbookPenelitianRepository.save(logbook));
    }

    public List<LogbookPenelitianDTO> getLogbooksByProposal(UUID proposalId) {
        if (!proposalRepository.existsById(proposalId)) {
            throw new ResourceNotFoundException("Proposal", "id", proposalId);
        }
        return logbookPenelitianRepository.findAll().stream()
                .filter(l -> l.getProposal().getId().equals(proposalId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private LogbookPenelitianDTO toDto(LogbookPenelitian logbook) {
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
}
