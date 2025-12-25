package com.civicpulse.dto;

import com.civicpulse.model.Grievance;

public class GrievanceDTO {

    private Long id;
    private Long userId;

    private Long categoryId;
    private String categoryName;

    private String title;
    private String description;
    private String imagePath;
    private String location;
    private Double latitude;
    private Double longitude;

    private Grievance.Status status;
    private Grievance.Priority priority;

    // getters & setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Grievance.Status getStatus() {
        return status;
    }

    public void setStatus(Grievance.Status status) {
        this.status = status;
    }

    public Grievance.Priority getPriority() {
        return priority;
    }

    public void setPriority(Grievance.Priority priority) {
        this.priority = priority;
    }
}
