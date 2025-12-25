// backend/src/main/java/com/civicpulse/service/OfficerAssignmentService.java
package com.civicpulse.service;

import com.civicpulse.model.Grievance;
import com.civicpulse.model.OfficerAssignment;
import com.civicpulse.model.User;
import com.civicpulse.repository.OfficerAssignmentRepository;
import com.civicpulse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OfficerAssignmentService {

    private final OfficerAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public OfficerAssignmentService(OfficerAssignmentRepository assignmentRepository,
                                   UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    public List<OfficerAssignment> getAssignmentsByOfficerId(Long officerId) {
        return assignmentRepository.findByOfficerId(officerId);
    }

    public List<OfficerAssignment> getAssignmentsByGrievanceId(Long grievanceId) {
        return assignmentRepository.findByGrievanceId(grievanceId);
    }

    @Transactional
    public OfficerAssignment assignOfficerToGrievance(Long grievanceId, Long officerId, String department) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        OfficerAssignment assignment = new OfficerAssignment();
        assignment.setGrievance(new Grievance()); // Set just the ID
        assignment.getGrievance().setId(grievanceId);
        assignment.setOfficer(officer);
        assignment.setDepartment(department);

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public OfficerAssignment resolveAssignment(Long assignmentId, String remarks) {
        OfficerAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setResolvedAt(LocalDateTime.now());
        assignment.setRemarks(remarks);

        return assignmentRepository.save(assignment);
    }
}