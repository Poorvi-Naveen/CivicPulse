// backend/src/main/java/com/civicpulse/repository/GrievanceRepository.java
package com.civicpulse.repository;

import com.civicpulse.model.Grievance;
import com.civicpulse.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    //List<Grievance> findByUserId(Long userId);
    List<Grievance> findByUser(User user);
    List<Grievance> findByStatus(Grievance.Status status);
    List<Grievance> findByCategoryCategoryId(Long categoryId);
}