package com.sipelka.backend.service;

import com.sipelka.backend.dto.NotifikasiDTO;
import com.sipelka.backend.exception.ResourceNotFoundException;
import com.sipelka.backend.model.Notifikasi;
import com.sipelka.backend.model.User;
import com.sipelka.backend.repository.NotifikasiRepository;
import com.sipelka.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotifikasiService {

    private final NotifikasiRepository notifikasiRepository;
    private final UserRepository userRepository;
    private final FcmService fcmService;

    public NotifikasiService(NotifikasiRepository notifikasiRepository, UserRepository userRepository, FcmService fcmService) {
        this.notifikasiRepository = notifikasiRepository;
        this.userRepository = userRepository;
        this.fcmService = fcmService;
    }

    public NotifikasiDTO createNotifikasi(NotifikasiDTO dto) {
        return createNotifikasi(dto, null);
    }

    public NotifikasiDTO createNotifikasi(NotifikasiDTO dto, java.util.Map<String, String> data) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getUserId()));

        Notifikasi notifikasi = new Notifikasi();
        notifikasi.setUser(user);
        notifikasi.setJudulNotifikasi(dto.getJudulNotifikasi());
        notifikasi.setPesan(dto.getPesan());
        notifikasi.setTipeNotifikasi(dto.getTipeNotifikasi());
        notifikasi.setIsRead(false);

        Notifikasi saved = notifikasiRepository.save(notifikasi);

        // Send FCM Push Notification if the user has an FCM token
        if (user.getFcmToken() != null && !user.getFcmToken().trim().isEmpty()) {
            fcmService.sendPushNotification(user.getFcmToken(), saved.getJudulNotifikasi(), saved.getPesan(), data);
        }

        return toDto(saved);
    }

    public NotifikasiDTO markAsRead(UUID notifikasiId) {
        Notifikasi notifikasi = notifikasiRepository.findById(notifikasiId)
                .orElseThrow(() -> new ResourceNotFoundException("Notifikasi", "id", notifikasiId));

        notifikasi.setIsRead(true);
        return toDto(notifikasiRepository.save(notifikasi));
    }

    public List<NotifikasiDTO> getNotifikasiByUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return notifikasiRepository.findAll().stream()
                .filter(n -> n.getUser().getId().equals(userId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private NotifikasiDTO toDto(Notifikasi notifikasi) {
        NotifikasiDTO dto = new NotifikasiDTO();
        dto.setId(notifikasi.getId());
        dto.setUserId(notifikasi.getUser().getId());
        dto.setJudulNotifikasi(notifikasi.getJudulNotifikasi());
        dto.setPesan(notifikasi.getPesan());
        dto.setIsRead(notifikasi.getIsRead());
        dto.setTipeNotifikasi(notifikasi.getTipeNotifikasi());
        dto.setCreatedAt(notifikasi.getCreatedAt());
        return dto;
    }
}
