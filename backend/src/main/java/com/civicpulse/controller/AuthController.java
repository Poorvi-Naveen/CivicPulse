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
@CrossOrigin(origins = "http://localhost:4200") // Explicitly allow Angular
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
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) { // Changed return type to <?> for
                                                                              // flexibility

        // 1. Check if user exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 2. Validate Role Input
        String roleName = request.getRole();
        if (roleName == null || roleName.isEmpty()) {
            roleName = "CITIZEN"; // Default fallback
        }

        // Ensure role is uppercase to match logic
        roleName = roleName.toUpperCase();

        // 3. Find Role or Create it if missing (Self-Healing Logic)
        String finalRoleName = roleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> {
                    // Create the role if it doesn't exist in DB
                    Role newRole = new Role(finalRoleName);
                    return roleRepository.save(newRole);
                });

        // 4. Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(role));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()));

            // 2. Generate Token
            String token = jwtUtil.generateToken(authentication.getName());

            // 3. Get User Details (to send Role and Name to frontend)
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get the first role (assuming 1 role per user)
            String role = user.getRoles().isEmpty() ? "CITIZEN" : user.getRoles().iterator().next().getName();

            // 4. Create the JSON Response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role); // Now the frontend can see the role!
            response.put("name", user.getName());
            response.put("id", user.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}