// backend/src/main/java/com/civicpulse/controller/UserController.java
package com.civicpulse.controller;

import com.civicpulse.model.User;
import com.civicpulse.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/role/{role}")
    // @PreAuthorize("hasRole('ADMIN')") // Comment out or remove this for now
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    /*@GetMapping("/officers")
    public ResponseEntity<List<User>> getAllOfficers() {
        return ResponseEntity.ok(userService.getUsersByRole("OFFICER"));
    }*/

}