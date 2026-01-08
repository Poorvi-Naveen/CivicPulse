// backend/src/main/java/com/civicpulse/service/FeedbackService.java
package com.civicpulse.service;

import com.civicpulse.dto.FeedbackRequest;
import com.civicpulse.model.Feedback;
import com.civicpulse.model.Grievance;
import com.civicpulse.model.User;
import com.civicpulse.repository.FeedbackRepository;
import com.civicpulse.repository.GrievanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final GrievanceRepository grievanceRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            GrievanceRepository grievanceRepository
    ) {
        this.feedbackRepository = feedbackRepository;
        this.grievanceRepository = grievanceRepository;
    }

    public void submitFeedback(FeedbackRequest request, User citizen) {

        Grievance grievance = grievanceRepository.findById(request.getGrievanceId())
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (!"RESOLVED".equals(grievance.getStatus().name())) {
            throw new RuntimeException("Feedback allowed only for resolved complaints");
        }

        if (feedbackRepository.existsByGrievanceId(grievance.getId())) {
            throw new RuntimeException("Feedback already submitted");
        }

        Feedback feedback = new Feedback();
        feedback.setGrievance(grievance);
        feedback.setCitizen(citizen);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        feedback.setSubmittedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);
    }
}
