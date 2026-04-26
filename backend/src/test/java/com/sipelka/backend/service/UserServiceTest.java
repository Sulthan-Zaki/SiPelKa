package com.sipelka.backend.service;

import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.model.enums.UserRole;
import com.sipelka.backend.repository.UserRepository;
import com.sipelka.backend.exception.DuplicateResourceException;
import com.sipelka.backend.exception.InvalidCredentialsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
public class UserServiceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterAdminSuccessfully() {
        UserDto.AdminRegistrationRequest req = new UserDto.AdminRegistrationRequest();
        req.setName("Admin User");
        req.setEmail("admin@example.com");
        req.setNip("0000000000");
        req.setPassword("adminPass123!");
        req.setAdminToken("SIPELKA_ADMIN_SECRET_2026");

        UserDto.Response response = userService.registerAdmin(req);

        assertThat(response).isNotNull();
        assertThat(response.isActivated()).isTrue();
        assertThat(response.getRole()).isEqualTo(UserRole.ADMIN);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldRegisterUserSuccessfullyButNotActivated() {
        UserDto.UserRegistrationRequest req = new UserDto.UserRegistrationRequest();
        req.setName("Researcher User");
        req.setEmail("researcher@example.com");
        req.setNip("9876543210");
        req.setPassword("mySecurePassword123!");
        req.setRole(UserRole.RESEARCHER);

        UserDto.Response response = userService.registerUser(req);

        assertThat(response).isNotNull();
        assertThat(response.isActivated()).isFalse();
        assertThat(response.getRole()).isEqualTo(UserRole.RESEARCHER);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldThrowExceptionWhenRegisteringDuplicateEmail() {
        UserDto.UserRegistrationRequest req1 = new UserDto.UserRegistrationRequest();
        req1.setName("First User");
        req1.setEmail("duplicate@example.com");
        req1.setNip("11111111");
        req1.setPassword("password");
        userService.registerUser(req1);

        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("Second User");
        req2.setEmail("duplicate@example.com");
        req2.setNip("22222222");
        req2.setPassword("password");

        assertThatThrownBy(() -> userService.registerUser(req2))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("Email already exists");
    }

    @Test
    void shouldAuthenticateAdminSuccessfully() {
        UserDto.AdminRegistrationRequest regReq = new UserDto.AdminRegistrationRequest();
        regReq.setName("Auth Test Admin");
        regReq.setEmail("auth@example.com");
        regReq.setNip("77777777");
        regReq.setPassword("TargetPassword!");
        regReq.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        userService.registerAdmin(regReq);

        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("auth@example.com");
        loginReq.setPassword("TargetPassword!");

        UserDto.LoginResponse response = userService.login(loginReq);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNotNull();
        assertThat(response.getUser().getName()).isEqualTo("Auth Test Admin");
    }

    @Test
    void shouldThrowExceptionWhenLoggingInUnactivatedUser() {
        UserDto.UserRegistrationRequest regReq = new UserDto.UserRegistrationRequest();
        regReq.setName("Inactive User");
        regReq.setEmail("inactive@example.com");
        regReq.setNip("88888888");
        regReq.setPassword("CorrectPassword123");
        userService.registerUser(regReq);

        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("inactive@example.com");
        loginReq.setPassword("CorrectPassword123");

        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Account is not activated yet. Please wait for administrator approval.");
    }


    @Test
    void shouldThrowExceptionWhenRegisteringAdminWithInvalidToken() {
        UserDto.AdminRegistrationRequest req = new UserDto.AdminRegistrationRequest();
        req.setName("Admin User");
        req.setEmail("admin_invalid@example.com");
        req.setNip("0000000000");
        req.setPassword("adminPass123!");
        req.setAdminToken("INVALID_TOKEN");

        assertThatThrownBy(() -> userService.registerAdmin(req))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid admin token");
    }

    @Test
    void shouldThrowExceptionWhenRegisteringAdminWithDuplicateNip() {
        UserDto.AdminRegistrationRequest req1 = new UserDto.AdminRegistrationRequest();
        req1.setName("Admin One");
        req1.setEmail("admin1@example.com");
        req1.setNip("12345678");
        req1.setPassword("pass");
        req1.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        userService.registerAdmin(req1);

        UserDto.AdminRegistrationRequest req2 = new UserDto.AdminRegistrationRequest();
        req2.setName("Admin Two");
        req2.setEmail("admin2@example.com");
        req2.setNip("12345678"); // Duplicate NIP
        req2.setPassword("pass");
        req2.setAdminToken("SIPELKA_ADMIN_SECRET_2026");

        assertThatThrownBy(() -> userService.registerAdmin(req2))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("NIP already exists");
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithDuplicateNip() {
        UserDto.UserRegistrationRequest req1 = new UserDto.UserRegistrationRequest();
        req1.setName("User One");
        req1.setEmail("user1@example.com");
        req1.setNip("87654321");
        req1.setPassword("pass");
        userService.registerUser(req1);

        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("User Two");
        req2.setEmail("user2@example.com");
        req2.setNip("87654321"); // Duplicate NIP
        req2.setPassword("pass");

        assertThatThrownBy(() -> userService.registerUser(req2))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("NIP already exists");
    }

    @Test
    void shouldAssignResearcherRoleWhenRegisteringUserWithAdminRole() {
        UserDto.UserRegistrationRequest req = new UserDto.UserRegistrationRequest();
        req.setName("Sneaky User");
        req.setEmail("sneaky@example.com");
        req.setNip("00001111");
        req.setPassword("pass");
        req.setRole(UserRole.ADMIN); // Tries to be admin via normal endpoint

        UserDto.Response response = userService.registerUser(req);
        
        assertThat(response.getRole()).isEqualTo(UserRole.RESEARCHER); // Should fallback to RESEARCHER
        assertThat(response.isActivated()).isFalse();
    }

    @Test
    void shouldThrowExceptionWhenActivatingNonExistentUser() {
        UUID randomId = UUID.randomUUID();
        assertThatThrownBy(() -> userService.activateUser(randomId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void shouldThrowExceptionWhenLoggingInWithNonExistentEmail() {
        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("nobody@example.com");
        loginReq.setPassword("password");

        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void shouldThrowExceptionWhenLoggingInWithWrongPassword() {
        UserDto.AdminRegistrationRequest regReq = new UserDto.AdminRegistrationRequest();
        regReq.setName("Admin User");
        regReq.setEmail("normal@example.com");
        regReq.setNip("12312312");
        regReq.setPassword("CorrectPassword123");
        regReq.setAdminToken("SIPELKA_ADMIN_SECRET_2026");
        userService.registerAdmin(regReq);

        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("normal@example.com");
        loginReq.setPassword("WrongPassword");

        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");
    }


    @Test
    void shouldGetAllUsersAndValidate() {
        UserDto.UserRegistrationRequest req1 = new UserDto.UserRegistrationRequest();
        req1.setName("User 1");
        req1.setEmail("u1@example.com");
        req1.setNip("1");
        req1.setPassword("pass");
        userService.registerUser(req1);

        UserDto.UserRegistrationRequest req2 = new UserDto.UserRegistrationRequest();
        req2.setName("User 2");
        req2.setEmail("u2@example.com");
        req2.setNip("2");
        req2.setPassword("pass");
        userService.registerUser(req2);

        List<UserDto.Response> users = userService.getAllUsers();
        assertThat(users).hasSize(2);
    }

    @Test
    void shouldDeleteUser() {
        UserDto.UserRegistrationRequest req = new UserDto.UserRegistrationRequest();
        req.setName("To Delete");
        req.setEmail("del@example.com");
        req.setNip("999");
        req.setPassword("pass");
        UserDto.Response res = userService.registerUser(req);

        assertThat(userService.getAllUsers()).hasSize(1);
        
        userService.deleteUser(res.getId());
        
        assertThat(userService.getAllUsers()).isEmpty();
    }
}
