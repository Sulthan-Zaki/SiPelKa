package com.sipelka.backend.controller;

import com.sipelka.backend.dto.UserDto;
import com.sipelka.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserDto.Response> registerAdmin(@RequestBody UserDto.AdminRegistrationRequest req) {
        return ResponseEntity.ok(userService.registerAdmin(req));
    }

    @PostMapping("/register/user")
    public ResponseEntity<UserDto.Response> registerUser(@RequestBody UserDto.UserRegistrationRequest req) {
        return ResponseEntity.ok(userService.registerUser(req));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<UserDto.Response> activateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@RequestBody UserDto.LoginRequest req) {
        return ResponseEntity.ok(userService.login(req));
    }


    @GetMapping
    public ResponseEntity<List<UserDto.Response>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto.Response> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDto.Response> createUser(@RequestBody UserDto.CreateUserRequest req) {
        return ResponseEntity.ok(userService.createUser(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto.Response> updateUser(@PathVariable UUID id, @RequestBody UserDto.UpdateUserRequest req) {
        return ResponseEntity.ok(userService.updateUser(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
