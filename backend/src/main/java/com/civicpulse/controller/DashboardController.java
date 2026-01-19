// backend/src/main/java/com/civicpulse/controller/DashboardController.java
package com.civicpulse.controller;

import com.civicpulse.dto.ChartData;
import com.civicpulse.repository.GrievanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, List<ChartData>>> getDashboardStats() {
        Map<String, List<ChartData>> response = new HashMap<>();
        
        response.put("categoryDistribution", grievanceRepository.findGrievancesByCategory());
        response.put("zoneHeatmap", grievanceRepository.findGrievancesByLocation());
        response.put("slaPerformance", grievanceRepository.findAvgResolutionTimeByCategory());
        
        return ResponseEntity.ok(response);
    }
}