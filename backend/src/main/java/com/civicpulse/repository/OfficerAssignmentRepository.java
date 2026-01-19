// backend/src/main/java/com/civicpulse/repository/OfficerAssignmentRepository.java
package com.civicpulse.repository;

import com.civicpulse.dto.ChartData;
import com.civicpulse.model.OfficerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerAssignmentRepository extends JpaRepository<OfficerAssignment, Long> {
    List<OfficerAssignment> findByOfficerId(Long officerId);

    List<OfficerAssignment> findByGrievanceId(Long grievanceId);

    Optional<OfficerAssignment> findTopByGrievanceIdOrderByResolvedAtDesc(Long grievanceId);

    @Query("SELECT g.status AS name, CAST(COUNT(oa) AS double) AS value " +
           "FROM OfficerAssignment oa JOIN oa.grievance g " +
           "WHERE oa.officer.id = :officerId " +
           "GROUP BY g.status")
    List<ChartData> findAssignmentsByStatus(@Param("officerId") Long officerId);

    @Query("SELECT g.location AS name, CAST(COUNT(oa) AS double) AS value " +
            "FROM OfficerAssignment oa JOIN oa.grievance g " +
            "WHERE oa.officer.id = :officerId AND g.location IS NOT NULL " +
            "GROUP BY g.location")
    List<ChartData> findAssignmentsByLocation(@Param("officerId") Long officerId);

    @Query("SELECT g.category.categoryName AS name, AVG(TIMESTAMPDIFF(HOUR, oa.assignedAt, oa.resolvedAt)) AS value " +
            "FROM OfficerAssignment oa JOIN oa.grievance g " +
            "WHERE oa.officer.id = :officerId AND oa.resolvedAt IS NOT NULL " +
            "GROUP BY g.category.categoryName")
    List<ChartData> findOfficerPerformance(@Param("officerId") Long officerId);
}