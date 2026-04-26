package com.sipelka.backend.service;

import com.sipelka.backend.dto.UserDto;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
public class UserServiceTest {

    // Automatically provisions a real Postgres docker container for this test suite
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Ensure a clean database state for every test case
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        UserDto.RegistrationRequest req = new UserDto.RegistrationRequest();
        req.setName("Service Unit Test User");
        req.setEmail("serviceuser@example.com");
        req.setNip("9876543210");
        req.setPassword("mySecurePassword123!");

        // Act
        UserDto.Response response = userService.register(req);

        // Assert output
        assertThat(response).isNotNull();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getName()).isEqualTo("Service Unit Test User");
        assertThat(response.getEmail()).isEqualTo("serviceuser@example.com");

        // Assert actual real postgres database state
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldThrowExceptionWhenRegisteringDuplicateEmail() {
        // Arrange - Insert first user
        UserDto.RegistrationRequest req1 = new UserDto.RegistrationRequest();
        req1.setName("First User");
        req1.setEmail("duplicate@example.com");
        req1.setNip("11111111");
        req1.setPassword("password");
        userService.register(req1);

        // Act & Assert - Try to insert second user with SAME email
        UserDto.RegistrationRequest req2 = new UserDto.RegistrationRequest();
        req2.setName("Second User");
        req2.setEmail("duplicate@example.com"); // Same email
        req2.setNip("22222222"); // Different NIP
        req2.setPassword("password");

        assertThatThrownBy(() -> userService.register(req2))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("Email already exists");

        // Ensure only the first user exists in Postgres
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldAuthenticateUserSuccessfully() {
        // Arrange
        UserDto.RegistrationRequest regReq = new UserDto.RegistrationRequest();
        regReq.setName("Auth Test User");
        regReq.setEmail("auth@example.com");
        regReq.setNip("77777777");
        regReq.setPassword("TargetPassword!");
        userService.register(regReq);

        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("auth@example.com");
        loginReq.setPassword("TargetPassword!");

        // Act
        UserDto.Response response = userService.login(loginReq);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Auth Test User");
    }

    @Test
    void shouldRejectInvalidPassword() {
        // Arrange
        UserDto.RegistrationRequest regReq = new UserDto.RegistrationRequest();
        regReq.setName("Bad Password User");
        regReq.setEmail("badpass@example.com");
        regReq.setNip("88888888");
        regReq.setPassword("CorrectPassword123");
        userService.register(regReq);

        UserDto.LoginRequest loginReq = new UserDto.LoginRequest();
        loginReq.setEmail("badpass@example.com");
        loginReq.setPassword("WrongPassword!!!"); // Wrong password

        // Act & Assert
        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");
    }
}
