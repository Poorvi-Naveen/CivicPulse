// backend/src/main/java/com/civicpulse/repository/FeedbackRepository.java
package com.civicpulse.repository;

import com.civicpulse.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    boolean existsByGrievanceId(Long grievanceId);
    Optional<Feedback> findByGrievanceId(Long grievanceId);
    void deleteByGrievanceId(Long grievanceId);
}