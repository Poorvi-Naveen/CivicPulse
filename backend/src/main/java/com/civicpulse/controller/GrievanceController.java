// backend/src/main/java/com/civicpulse/controller/GrievanceController.java
package com.civicpulse.controller;

import com.civicpulse.dto.GrievanceDTO;
import com.civicpulse.dto.StatusUpdateRequest;
import com.civicpulse.model.Grievance;
import com.civicpulse.model.User;
import com.civicpulse.service.GrievanceService;
import com.civicpulse.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceService grievanceService;
    private final UserService userService;

    public GrievanceController(GrievanceService grievanceService, UserService userService) {
        this.grievanceService = grievanceService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<GrievanceDTO> createGrievance(
            @RequestBody GrievanceDTO grievanceDTO,
            Authentication authentication) {

        String email = authentication.getName(); // from JWT
        User user = userService.findByEmail(email);

        GrievanceDTO created = grievanceService.createGrievance(grievanceDTO, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    // @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')") // Comment out or remove this
    // for now
    public ResponseEntity<List<GrievanceDTO>> getAllGrievances() {
        List<GrievanceDTO> grievances = grievanceService.getAllGrievances();
        return ResponseEntity.ok(grievances);
    }

    // @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('CITIZEN') or #userId == authentication.principal.id")
    // // Comment out or remove this for now
    /*
     * public ResponseEntity<List<GrievanceDTO>> getGrievancesByUser(@PathVariable
     * Long userId) {
     * List<GrievanceDTO> grievances =
     * grievanceService.getGrievancesByUserId(userId);
     * return ResponseEntity.ok(grievances);
     * }
     */

    @GetMapping("/status/{status}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')") // Comment out or remove this
    // for now
    public ResponseEntity<List<GrievanceDTO>> getGrievancesByStatus(@PathVariable Grievance.Status status) {
        List<GrievanceDTO> grievances = grievanceService.getGrievancesByStatus(status);
        return ResponseEntity.ok(grievances);
    }

    @PutMapping("/{grievanceId}/status")
    public ResponseEntity<GrievanceDTO> updateGrievanceStatus(
            @PathVariable Long grievanceId,
            @RequestBody StatusUpdateRequest request) {

        if (request.getStatus() == null) {
            return ResponseEntity.badRequest().build();
        }

        GrievanceDTO updated = grievanceService.updateGrievanceStatus(
                grievanceId,
                request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/my")
    public ResponseEntity<List<GrievanceDTO>> getMyGrievances(
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                grievanceService.getGrievancesByUser(user));
    }
}