// backend/src/main/java/com/civicpulse/repository/GrievanceRepository.java
package com.civicpulse.repository;

import com.civicpulse.dto.ChartData;
import com.civicpulse.model.Grievance;
import com.civicpulse.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    // List<Grievance> findByUserId(Long userId);
    List<Grievance> findByUser(User user);

    List<Grievance> findByStatus(Grievance.Status status);

    List<Grievance> findByCategoryCategoryId(Long categoryId);

    @Query("SELECT c.categoryName AS name, CAST(COUNT(g) AS double) AS value " +
            "FROM Grievance g JOIN g.category c GROUP BY c.categoryName")
    List<ChartData> findGrievancesByCategory();

    @Query("SELECT g.location AS name, CAST(COUNT(g) AS double) AS value " +
            "FROM Grievance g WHERE g.location IS NOT NULL GROUP BY g.location ORDER BY value DESC")
    List<ChartData> findGrievancesByLocation();

    @Query("SELECT c.categoryName AS name, AVG(TIMESTAMPDIFF(HOUR, g.createdAt, g.updatedAt)) AS value " +
            "FROM Grievance g JOIN g.category c " +
            "WHERE g.status = 'RESOLVED' " +
            "GROUP BY c.categoryName")
    List<ChartData> findAvgResolutionTimeByCategory();
}