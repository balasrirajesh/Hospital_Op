package com.hospital.op.dto;

public class AppointmentStatusUpdateRequest {

    private String status; // CONFIRMED, WAITING, VISITED, COMPLETED, CANCELLED
    private String reason;

    public AppointmentStatusUpdateRequest() {
    }

    public AppointmentStatusUpdateRequest(String status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
