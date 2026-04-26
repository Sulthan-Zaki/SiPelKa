package com.sipelka.backend.service;

import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.model.User;
import com.sipelka.backend.model.enums.UserRole;
import com.sipelka.backend.repository.UserRepository;
import com.sipelka.backend.exception.DuplicateResourceException;
import com.sipelka.backend.exception.InvalidCredentialsException;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final String ADMIN_SECRET_TOKEN = "SIPELKA_ADMIN_SECRET_2026";
    private final UserRepository userRepository;
    private final Pbkdf2PasswordEncoder passwordEncoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto.Response registerAdmin(UserDto.AdminRegistrationRequest req) {
        if (!ADMIN_SECRET_TOKEN.equals(req.getAdminToken())) {
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

    public UserDto.Response login(UserDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        
        if (!user.isActivated()) {
            throw new IllegalStateException("Account is not activated yet. Please wait for administrator approval.");
        }

        return toResponse(user);
    }

    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
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
