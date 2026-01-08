// backend/src/main/java/com/civicpulse/model/Feedback.java
package com.civicpulse.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating; // 1-5

    @Column(length = 1000)
    private String comments;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private User citizen;

    @ManyToOne
    @JoinColumn(name = "grievance_id")
    private Grievance grievance;

    // getters & setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public String getComments() {
        return comments;
    }
    public void setComments(String comments) {
        this.comments = comments;
    }
    public User getCitizen() {
        return citizen;
    }
    public void setCitizen(User citizen) {
        this.citizen = citizen;
    }
    public Grievance getGrievance() {
        return grievance;
    }
    public void setGrievance(Grievance grievance) {
        this.grievance = grievance;
    }
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
