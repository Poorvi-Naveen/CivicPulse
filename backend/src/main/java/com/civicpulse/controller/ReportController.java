//backend/src/main/java/com/civicpulse/controller/ReportController.java
package com.civicpulse.controller;

import com.civicpulse.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping("/preview/{grievanceId}")
    public ResponseEntity<Map<String, Object>> getReportPreview(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(reportService.getGrievanceReportData(grievanceId));
    }
    @GetMapping("/download/{grievanceId}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long grievanceId) {
        byte[] pdfBytes = reportService.generatePdfReport(grievanceId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_" + grievanceId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}