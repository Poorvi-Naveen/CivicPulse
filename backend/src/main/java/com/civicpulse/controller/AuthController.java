package com.civicpulse.controller;

import com.civicpulse.dto.LoginRequest;
import com.civicpulse.dto.RegisterRequest;
import com.civicpulse.model.Role;
import com.civicpulse.model.User;
import com.civicpulse.repository.RoleRepository;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.config.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") 
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) { 
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        String roleName = request.getRole();
        if (roleName == null || roleName.isEmpty()) {
            roleName = "CITIZEN"; 
        }
        roleName = roleName.toUpperCase();
        String finalRoleName = roleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> {
                    Role newRole = new Role(finalRoleName);
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(role));
        if ("OFFICER".equals(finalRoleName)) {
            user.setDepartment(request.getDepartment());
        }
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()));
            String token = jwtUtil.generateToken(authentication.getName());
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String role = user.getRoles().isEmpty() ? "CITIZEN" : user.getRoles().iterator().next().getName();
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role); 
            response.put("name", user.getName());
            response.put("id", user.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}