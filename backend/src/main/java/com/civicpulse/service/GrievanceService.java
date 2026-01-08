// backend/src/main/java/com/civicpulse/service/GrievanceService.java
package com.civicpulse.service;

import com.civicpulse.dto.GrievanceDTO;
import com.civicpulse.model.ComplaintCategory;
import com.civicpulse.model.Grievance;
import com.civicpulse.model.User;
import com.civicpulse.repository.ComplaintCategoryRepository;
import com.civicpulse.repository.GrievanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final ComplaintCategoryRepository categoryRepository;

    public GrievanceService(
            GrievanceRepository grievanceRepository,
            ComplaintCategoryRepository categoryRepository) {

        this.grievanceRepository = grievanceRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<GrievanceDTO> getAllGrievances() {
        return grievanceRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<GrievanceDTO> getGrievancesByUser(User user) {
        return grievanceRepository.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<GrievanceDTO> getGrievancesByStatus(Grievance.Status status) {
        return grievanceRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GrievanceDTO createGrievance(GrievanceDTO grievanceDTO, User user) {

        ComplaintCategory category = null;
        if (grievanceDTO.getCategoryId() != null) {
            Long categoryId = grievanceDTO.getCategoryId();
            if (categoryId <= 0) {
                throw new IllegalArgumentException("Invalid category id");
            }
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Grievance grievance = new Grievance();
        grievance.setUser(user); // ✅ SINGLE SOURCE OF TRUTH
        grievance.setCategory(category);
        grievance.setTitle(grievanceDTO.getTitle());
        grievance.setDescription(grievanceDTO.getDescription());
        grievance.setImagePath(grievanceDTO.getImagePath());
        grievance.setLocation(grievanceDTO.getLocation());
        grievance.setLatitude(grievanceDTO.getLatitude());
        grievance.setLongitude(grievanceDTO.getLongitude());
        grievance.setStatus(Grievance.Status.PENDING);
        grievance.setPriority(Grievance.Priority.MEDIUM);

        return convertToDTO(grievanceRepository.save(grievance));
    }

    @Transactional
    public GrievanceDTO updateGrievanceStatus(Long grievanceId, Grievance.Status status) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        grievance.setStatus(status);
        return convertToDTO(grievanceRepository.save(grievance));
    }

    private GrievanceDTO convertToDTO(Grievance grievance) {
        GrievanceDTO dto = new GrievanceDTO();
        dto.setId(grievance.getId());
        dto.setUserId(grievance.getUser().getId()); // frontend still uses this
        dto.setCategoryId(
                grievance.getCategory() != null
                        ? grievance.getCategory().getCategoryId()
                        : null);
        dto.setCategoryName(
                grievance.getCategory() != null
                        ? grievance.getCategory().getCategoryName()
                        : null);
        dto.setTitle(grievance.getTitle());
        dto.setDescription(grievance.getDescription());
        dto.setImagePath(grievance.getImagePath());
        dto.setLocation(grievance.getLocation());
        dto.setLatitude(grievance.getLatitude());
        dto.setLongitude(grievance.getLongitude());
        dto.setStatus(grievance.getStatus());
        dto.setPriority(grievance.getPriority());
        dto.setAdminRemark(grievance.getAdminRemark());
        dto.setCitizenFeedback(grievance.getCitizenFeedback());
        dto.setReopenCount(grievance.getReopenCount());
        return dto;
    }

    @Transactional
    public void approveGrievance(Long grievanceId) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (grievance.getStatus() != Grievance.Status.PENDING &&
    grievance.getStatus() != Grievance.Status.REOPENED) {
            throw new IllegalStateException("Only pending or reopened grievances can be approved");
        }

        grievance.setStatus(Grievance.Status.APPROVED);
        grievance.setAdminRemark(null);
        grievanceRepository.save(grievance);
    }

    @Transactional
    public void rejectGrievance(Long grievanceId, String remark) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (grievance.getStatus() != Grievance.Status.PENDING) {
            throw new IllegalStateException("Only pending grievances can be rejected");
        }

        grievance.setStatus(Grievance.Status.REJECTED);
        grievance.setAdminRemark(remark);
        grievanceRepository.save(grievance);
    }

    public void reopenComplaint(Long grievanceId, String remark) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (!"RESOLVED".equals(grievance.getStatus().name())) {
            throw new RuntimeException("Only resolved complaints can be reopened");
        }

        grievance.setStatus(Grievance.Status.REOPENED);
        grievance.setCitizenFeedback(remark);
        grievance.setReopenCount(grievance.getReopenCount() + 1);
        grievanceRepository.save(grievance);
    }

    @Transactional
    public void approveReopenedGrievance(Long grievanceId) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (grievance.getStatus() != Grievance.Status.REOPENED) {
            throw new IllegalStateException("Only reopened grievances can be approved");
        }

        grievance.setStatus(Grievance.Status.APPROVED);
        grievance.setAdminRemark(null);

        grievanceRepository.save(grievance);
    }

    @Transactional
    public void rejectReopenedGrievance(Long grievanceId, String remark) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (grievance.getStatus() != Grievance.Status.REOPENED) {
            throw new IllegalStateException("Only reopened grievances can be rejected");
        }

        grievance.setStatus(Grievance.Status.REJECTED);
        grievance.setAdminRemark(remark);

        grievanceRepository.save(grievance);
    }

}
