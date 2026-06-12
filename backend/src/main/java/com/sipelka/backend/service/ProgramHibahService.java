package com.sipelka.backend.service;

import com.sipelka.backend.dto.ProgramHibahDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.ProgramHibah;
import com.sipelka.backend.model.User;
import com.sipelka.backend.repository.ProgramHibahRepository;
import com.sipelka.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgramHibahService {

    private final ProgramHibahRepository programHibahRepository;
    private final UserRepository userRepository;
    private final NotifikasiService notifikasiService;

    public ProgramHibahService(ProgramHibahRepository programHibahRepository, UserRepository userRepository, NotifikasiService notifikasiService) {
        this.programHibahRepository = programHibahRepository;
        this.userRepository = userRepository;
        this.notifikasiService = notifikasiService;
    }

    public ProgramHibahDTO createHibah(ProgramHibahDTO dto) {
        User admin = userRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAdminId()));

        ProgramHibah hibah = new ProgramHibah();
        hibah.setAdmin(admin);
        hibah.setNamaProgram(dto.getNamaProgram());
        hibah.setDeskripsi(dto.getDeskripsi());
        hibah.setBidangFokus(dto.getBidangFokus());
        hibah.setTanggalBuka(dto.getTanggalBuka());
        hibah.setTanggalTutup(dto.getTanggalTutup());
        hibah.setTotalDanaMaksimal(dto.getTotalDanaMaksimal());

        ProgramHibah saved = programHibahRepository.save(hibah);

        // Notify all researchers about the new program hibah
        List<User> researchers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.sipelka.backend.model.enums.UserRole.RESEARCHER)
                .collect(Collectors.toList());

        for (User researcher : researchers) {
            try {
                java.util.Map<String, String> data = new java.util.HashMap<>();
                data.put("type", "grant");
                data.put("id", saved.getId().toString());

                com.sipelka.backend.dto.NotifikasiDTO notifDto = com.sipelka.backend.dto.NotifikasiDTO.builder()
                        .userId(researcher.getId())
                        .judulNotifikasi("Program Hibah Baru")
                        .pesan("Program hibah baru '" + saved.getNamaProgram() + "' telah dibuka! Silakan ajukan proposal Anda.")
                        .tipeNotifikasi(com.sipelka.backend.model.enums.TipeNotifikasi.SYSTEM)
                        .build();
                notifikasiService.createNotifikasi(notifDto, data);
            } catch (Exception e) {
                // Log or ignore to prevent blocking the creation of ProgramHibah
            }
        }

        return toDto(saved);
    }

    public ProgramHibahDTO updateHibah(UUID id, ProgramHibahDTO dto) {
        ProgramHibah hibah = programHibahRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProgramHibah", "id", id));

        hibah.setNamaProgram(dto.getNamaProgram());
        hibah.setDeskripsi(dto.getDeskripsi());
        hibah.setBidangFokus(dto.getBidangFokus());
        hibah.setTanggalBuka(dto.getTanggalBuka());
        hibah.setTanggalTutup(dto.getTanggalTutup());
        hibah.setTotalDanaMaksimal(dto.getTotalDanaMaksimal());

        return toDto(programHibahRepository.save(hibah));
    }

    public void deleteHibah(UUID id) {
        if (!programHibahRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProgramHibah", "id", id);
        }
        programHibahRepository.deleteById(id);
    }

    public ProgramHibahDTO getHibahById(UUID id) {
        return programHibahRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ProgramHibah", "id", id));
    }

    public List<ProgramHibahDTO> getAllHibah() {
        return programHibahRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProgramHibahDTO> getOpenHibah() {
        LocalDateTime now = LocalDateTime.now();
        return programHibahRepository.findAll().stream()
                .filter(h -> h.getTanggalBuka() != null && h.getTanggalTutup() != null &&
                        (h.getTanggalBuka().isBefore(now) || h.getTanggalBuka().isEqual(now)) &&
                        (h.getTanggalTutup().isAfter(now) || h.getTanggalTutup().isEqual(now)))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProgramHibahDTO toDto(ProgramHibah hibah) {
        ProgramHibahDTO dto = new ProgramHibahDTO();
        dto.setId(hibah.getId());
        dto.setAdminId(hibah.getAdmin().getId());
        dto.setNamaProgram(hibah.getNamaProgram());
        dto.setDeskripsi(hibah.getDeskripsi());
        dto.setBidangFokus(hibah.getBidangFokus());
        dto.setTanggalBuka(hibah.getTanggalBuka());
        dto.setTanggalTutup(hibah.getTanggalTutup());
        dto.setTotalDanaMaksimal(hibah.getTotalDanaMaksimal());
        dto.setCreatedAt(hibah.getCreatedAt());
        return dto;
    }
}
