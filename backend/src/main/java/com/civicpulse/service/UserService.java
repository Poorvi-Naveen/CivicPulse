package com.civicpulse.service;

import com.civicpulse.dto.RegisterRequest;
import com.civicpulse.model.Role;
import com.civicpulse.model.User;
import com.civicpulse.repository.RoleRepository;
import com.civicpulse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
    }

    @PostConstruct
    public void initRoles() {
        if (roleRepository.findByName("CITIZEN").isEmpty()) {
            roleRepository.save(new Role("CITIZEN"));
            roleRepository.save(new Role("OFFICER"));
            roleRepository.save(new Role("ADMIN"));
        }
    }

    public User registerCitizen(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User u = new User();
        u.setName(request.getName());
        u.setEmail(request.getEmail());
        u.setPassword(encoder.encode(request.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role citizenRole = roleRepository.findByName("CITIZEN")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roles.add(citizenRole);

        u.setRoles(roles);
        return userRepository.save(u);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role.toUpperCase());
    }

    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

}