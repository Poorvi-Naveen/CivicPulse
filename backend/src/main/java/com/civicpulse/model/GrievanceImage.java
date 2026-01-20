package com.civicpulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grievance_images")
public class GrievanceImage {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

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
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public Grievance getGrievance() {
        return grievance;
    }
    public void setGrievance(Grievance grievance) {
        this.grievance = grievance;
    }
}
