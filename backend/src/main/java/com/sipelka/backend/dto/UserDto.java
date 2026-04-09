package com.sipelka.backend.dto;

import lombok.Data;
import java.util.UUID;

public class UserDto {

    @Data
    public static class RegistrationRequest {
        private String name;
        private String email;
        private String nip;
        private String password;
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
    }
}
