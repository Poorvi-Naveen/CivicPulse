// backend/src/main/java/com/civicpulse/repository/OfficerAssignmentRepository.java
package com.civicpulse.repository;

import com.civicpulse.model.OfficerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerAssignmentRepository extends JpaRepository<OfficerAssignment, Long> {
    List<OfficerAssignment> findByOfficerId(Long officerId);
    List<OfficerAssignment> findByGrievanceId(Long grievanceId);
    Optional<OfficerAssignment> findTopByGrievanceIdOrderByResolvedAtDesc(Long grievanceId);
}