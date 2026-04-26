package com.sipelka.backend.service;

import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.model.User;
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

    private final UserRepository userRepository;
    private final Pbkdf2PasswordEncoder passwordEncoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto.Response register(UserDto.RegistrationRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (userRepository.findByNip(req.getNip()).isPresent()) {
            throw new DuplicateResourceException("NIP already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setNip(req.getNip());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    public UserDto.Response login(UserDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
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
        return res;
    }
}
