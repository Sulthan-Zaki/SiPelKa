package com.sipelka.backend.service;

import com.sipelka.backend.dto.PencairanDanaDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.PencairanDana;
import com.sipelka.backend.model.Proposal;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.StatusPencairan;
import com.sipelka.backend.repository.PencairanDanaRepository;
import com.sipelka.backend.repository.ProposalRepository;
import com.sipelka.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PencairanDanaService {

    private final PencairanDanaRepository pencairanDanaRepository;
    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;

    public PencairanDanaService(PencairanDanaRepository pencairanDanaRepository, ProposalRepository proposalRepository, UserRepository userRepository) {
        this.pencairanDanaRepository = pencairanDanaRepository;
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PencairanDanaDTO createPencairan(PencairanDanaDTO dto) {
        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", dto.getProposalId()));
        User admin = userRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAdminId()));

        PencairanDana pencairan = new PencairanDana();
        pencairan.setProposal(proposal);
        pencairan.setAdmin(admin);
        pencairan.setTahapPencairan(dto.getTahapPencairan());
        pencairan.setJumlahDana(dto.getJumlahDana());
        pencairan.setStatusPencairan(StatusPencairan.PENDING);
        pencairan.setTanggalPencairan(null);
        pencairan.setBuktiTransferUrl(dto.getBuktiTransferUrl());

        return toDto(pencairanDanaRepository.save(pencairan));
    }

    @Transactional
    public PencairanDanaDTO updateStatusPencairan(UUID id, StatusPencairan status, String buktiTransferUrl) {
        PencairanDana pencairan = pencairanDanaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PencairanDana", "id", id));

        pencairan.setStatusPencairan(status);
        if (status == StatusPencairan.CAIR) {
            pencairan.setTanggalPencairan(LocalDateTime.now());
        }
        if (buktiTransferUrl != null) {
            pencairan.setBuktiTransferUrl(buktiTransferUrl);
        }

        return toDto(pencairanDanaRepository.save(pencairan));
    }

    public List<PencairanDanaDTO> getPencairanByProposal(UUID proposalId) {
        if (!proposalRepository.existsById(proposalId)) {
            throw new ResourceNotFoundException("Proposal", "id", proposalId);
        }
        return pencairanDanaRepository.findAllWithProposalAndAdmin().stream()
                .filter(p -> p.getProposal().getId().equals(proposalId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PencairanDanaDTO> getAllPencairan() {
        return pencairanDanaRepository.findAllWithProposalAndAdmin().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PencairanDanaDTO toDto(PencairanDana pencairan) {
        PencairanDanaDTO dto = new PencairanDanaDTO();
        dto.setId(pencairan.getId());
        dto.setProposalId(pencairan.getProposal().getId());
        dto.setProposalTitle(pencairan.getProposal().getJudulPenelitian());
        dto.setPenelitiName(pencairan.getProposal().getPeneliti().getName());
        dto.setAdminId(pencairan.getAdmin().getId());
        dto.setTahapPencairan(pencairan.getTahapPencairan());
        dto.setJumlahDana(pencairan.getJumlahDana());
        dto.setStatusPencairan(pencairan.getStatusPencairan());
        dto.setTanggalPencairan(pencairan.getTanggalPencairan());
        dto.setBuktiTransferUrl(pencairan.getBuktiTransferUrl());
        return dto;
    }
}
