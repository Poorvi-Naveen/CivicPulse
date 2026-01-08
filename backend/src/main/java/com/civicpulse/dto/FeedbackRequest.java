// backend/src/main/java/com/civicpulse/dto/FeedbackRequest.java
package com.civicpulse.dto;

public class FeedbackRequest {

    private Long grievanceId;
    private int rating;
    private String comments;

    // getters & setters
    public Long getGrievanceId() {
        return grievanceId;
    }
    public void setGrievanceId(Long grievanceId) {
        this.grievanceId = grievanceId;
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
}
