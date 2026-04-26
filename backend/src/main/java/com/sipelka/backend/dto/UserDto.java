package com.sipelka.backend.dto;

import com.sipelka.backend.model.enums.UserRole;
import lombok.Data;
import java.util.UUID;

public class UserDto {

    @Data
    public static class AdminRegistrationRequest {
        private String name;
        private String email;
        private String nip;
        private String password;
        private String adminToken;
    }

    @Data
    public static class UserRegistrationRequest {
        private String name;
        private String email;
        private String nip;
        private String password;
        private UserRole role;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class Response {
        private UUID id;
        private String name;
        private String email;
        private String nip;
        private UserRole role;
        private boolean isActivated;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private Response user;
    }
}

