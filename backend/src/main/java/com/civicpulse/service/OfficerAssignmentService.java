// backend/src/main/java/com/civicpulse/service/OfficerAssignmentService.java
package com.civicpulse.service;

import com.civicpulse.model.Grievance;
import com.civicpulse.model.OfficerAssignment;
import com.civicpulse.model.User;
import com.civicpulse.repository.OfficerAssignmentRepository;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.repository.GrievanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OfficerAssignmentService {

    private final OfficerAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final GrievanceRepository grievanceRepository;

    public OfficerAssignmentService(OfficerAssignmentRepository assignmentRepository,
            UserRepository userRepository,
            GrievanceRepository grievanceRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.grievanceRepository = grievanceRepository;
    }

    public List<OfficerAssignment> getAssignmentsByOfficerId(Long officerId) {
        return assignmentRepository.findByOfficerId(officerId);
    }

    public List<OfficerAssignment> getAssignmentsByGrievanceId(Long grievanceId) {
        return assignmentRepository.findByGrievanceId(grievanceId);
    }

    @Transactional
    public OfficerAssignment assignOfficerToGrievance(
            Long grievanceId,
            Long officerId,
            String department,
            Grievance.Priority priority,
            Long deadlineDays) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        grievance.setPriority(priority);
        grievance.setStatus(Grievance.Status.IN_PROGRESS);

        grievanceRepository.save(grievance);

        OfficerAssignment assignment = new OfficerAssignment();
        assignment.setGrievance(grievance);
        assignment.setOfficer(officer);
        assignment.setDepartment(department);
        assignment.setPriority(priority);
        assignment.setDeadline(LocalDateTime.now().plusDays(deadlineDays));
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void submitResolution(
            Long assignmentId,
            String remarks,
            MultipartFile proofImage) throws IOException {
        OfficerAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (proofImage == null || proofImage.isEmpty()) {
            throw new RuntimeException("Proof image is required");
        }

        assignment.setRemarks(remarks);
        assignment.setResolvedAt(LocalDateTime.now());

        Grievance grievance = assignment.getGrievance();
        grievance.setStatus(Grievance.Status.RESOLUTION_SUBMITTED);

        grievanceRepository.save(grievance);
        assignmentRepository.save(assignment);
    }

    @Transactional
    public OfficerAssignment resolveAssignment(Long assignmentId, String remarks) {
        OfficerAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setResolvedAt(LocalDateTime.now());
        assignment.setRemarks(remarks);

        return assignmentRepository.save(assignment);
    }

    public OfficerAssignment getLatestAssignmentByGrievance(Long grievanceId) {
        return assignmentRepository
                .findTopByGrievanceIdOrderByResolvedAtDesc(grievanceId)
                .orElseThrow(() -> new RuntimeException("Resolution not found"));
    }

}