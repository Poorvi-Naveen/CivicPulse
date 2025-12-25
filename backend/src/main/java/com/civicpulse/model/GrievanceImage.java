package com.civicpulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grievance_images")
public class GrievanceImage {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl; // or filePath

    @ManyToOne
    @JoinColumn(name = "grievance_id")
    private Grievance grievance;

    // getters & setters
}
