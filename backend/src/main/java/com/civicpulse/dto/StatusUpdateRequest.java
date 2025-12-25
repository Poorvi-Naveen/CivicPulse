package com.civicpulse.dto;

import com.civicpulse.model.Grievance;

public class StatusUpdateRequest {

    private Grievance.Status status;

    public Grievance.Status getStatus() {
        return status;
    }

    public void setStatus(Grievance.Status status) {
        this.status = status;
    }
}
