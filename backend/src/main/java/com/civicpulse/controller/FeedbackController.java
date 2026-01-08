// backend/src/main/java/com/civicpulse/controller/FeedbackController.java
package com.civicpulse.controller;

import com.civicpulse.dto.FeedbackRequest;
import com.civicpulse.model.User;
import com.civicpulse.service.FeedbackService;
import com.civicpulse.repository.FeedbackRepository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackService feedbackService, FeedbackRepository feedbackRepository) {
        this.feedbackService = feedbackService;
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping("/grievance/{id}")
    public ResponseEntity<?> getFeedback(@PathVariable Long id) {
        return feedbackRepository.findByGrievanceId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submitFeedback(
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal User citizen) {
        feedbackService.submitFeedback(request, citizen);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Feedback submitted successfully");

        return ResponseEntity.ok(response);
    }

}
