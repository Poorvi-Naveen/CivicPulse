// backend/src/main/java/com/civicpulse/controller/OfficerAssignmentController.java
package com.civicpulse.controller;

import com.civicpulse.model.Grievance;
import com.civicpulse.model.OfficerAssignment;
import com.civicpulse.service.OfficerAssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class OfficerAssignmentController {

    private final OfficerAssignmentService assignmentService;

    public OfficerAssignmentController(OfficerAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/officer/{officerId}")
    @PreAuthorize("hasRole('OFFICER') or #officerId == authentication.principal.id")
    public ResponseEntity<List<OfficerAssignment>> getAssignmentsByOfficer(@PathVariable Long officerId) {
        List<OfficerAssignment> assignments = assignmentService.getAssignmentsByOfficerId(officerId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/grievance/{grievanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<OfficerAssignment>> getAssignmentsByGrievance(@PathVariable Long grievanceId) {
        List<OfficerAssignment> assignments = assignmentService.getAssignmentsByGrievanceId(grievanceId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficerAssignment> assignOfficer(
            @RequestParam Long grievanceId,
            @RequestParam Long officerId,
            @RequestParam String department,
            @RequestParam Grievance.Priority priority,
            @RequestParam String deadline) {
        OfficerAssignment assignment = assignmentService.assignOfficerToGrievance(
                grievanceId,
                officerId,
                department,
                priority,
                deadline);

        return new ResponseEntity<>(assignment, HttpStatus.CREATED);
    }

    @PutMapping("/{assignmentId}/resolve")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<OfficerAssignment> resolveAssignment(
            @PathVariable Long assignmentId,
            @RequestParam String remarks) {
        OfficerAssignment assignment = assignmentService.resolveAssignment(assignmentId, remarks);
        return ResponseEntity.ok(assignment);
    }
}