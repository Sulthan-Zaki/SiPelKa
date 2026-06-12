package com.sipelka.backend.service;

import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.UserRole;
import com.sipelka.backend.repository.UserRepository;
import com.sipelka.backend.exception.DuplicateResourceException;
import com.sipelka.backend.exception.InvalidCredentialsException;
import com.sipelka.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Value("${app.admin-token}")
    private String adminSecretToken;
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final Pbkdf2PasswordEncoder passwordEncoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public UserDto.Response registerAdmin(UserDto.AdminRegistrationRequest req) {
        if (!adminSecretToken.equals(req.getAdminToken())) {
            throw new InvalidCredentialsException("Invalid admin token");
        }
        checkDuplicates(req.getEmail(), req.getNip());

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setNip(req.getNip());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(UserRole.ADMIN);
        user.setActivated(true); // Admins are auto-activated

        return toResponse(userRepository.save(user));
    }

    public UserDto.Response registerUser(UserDto.UserRegistrationRequest req) {
        checkDuplicates(req.getEmail(), req.getNip());

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setNip(req.getNip());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        
        // Prevent registering as an admin through the normal user endpoint
        UserRole assignedRole = (req.getRole() != null && req.getRole() != UserRole.ADMIN)
                ? req.getRole()
                : UserRole.RESEARCHER;
        user.setRole(assignedRole);
        user.setActivated(false); // Needs admin activation

        return toResponse(userRepository.save(user));
    }

    public UserDto.Response activateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActivated(true);
        return toResponse(userRepository.save(user));
    }

    private void checkDuplicates(String email, String nip) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (userRepository.findByNip(nip).isPresent()) {
            throw new DuplicateResourceException("NIP already exists");
        }
    }

    public UserDto.LoginResponse login(UserDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        
        if (!user.isActivated()) {
            throw new IllegalStateException("Account is not activated yet. Please wait for administrator approval.");
        }

        if (req.getFcmToken() != null && !req.getFcmToken().trim().isEmpty()) {
            user.setFcmToken(req.getFcmToken());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        UserDto.LoginResponse res = new UserDto.LoginResponse();
        res.setToken(token);
        res.setUser(toResponse(user));
        return res;
    }

    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserDto.Response getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserDto.Response createUser(UserDto.CreateUserRequest req) {
        checkDuplicates(req.getEmail(), req.getNip());

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setNip(req.getNip());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : UserRole.RESEARCHER);
        user.setActivated(req.isActivated());

        return toResponse(userRepository.save(user));
    }

    public UserDto.Response updateUser(UUID id, UserDto.UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equals(req.getEmail())) {
            if (userRepository.findByEmail(req.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Email already exists");
            }
            user.setEmail(req.getEmail());
        }
        if (!user.getNip().equals(req.getNip())) {
            if (userRepository.findByNip(req.getNip()).isPresent()) {
                throw new DuplicateResourceException("NIP already exists");
            }
            user.setNip(req.getNip());
        }

        user.setName(req.getName());
        if (req.getRole() != null) {
            user.setRole(req.getRole());
        }
        user.setActivated(req.isActivated());

        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return toResponse(userRepository.save(user));
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public void changePassword(UUID userId, UserDto.ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    private UserDto.Response toResponse(User user) {
        UserDto.Response res = new UserDto.Response();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setNip(user.getNip());
        res.setRole(user.getRole());
        res.setActivated(user.isActivated());
        return res;
    }
}

