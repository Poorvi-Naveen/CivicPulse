// backend/src/main/java/com/civicpulse/dto/AssignOfficerRequest.java
package com.civicpulse.dto;

import com.civicpulse.model.Grievance;

public class AssignOfficerRequest {

    private Long officerId;
    private Grievance.Priority priority;

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public Grievance.Priority getPriority() {
        return priority;
    }

    public void setPriority(Grievance.Priority priority) {
        this.priority = priority;
    }
}
