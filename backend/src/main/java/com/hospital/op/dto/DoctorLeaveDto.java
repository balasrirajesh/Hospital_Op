package com.hospital.op.dto;

import java.time.LocalDate;

public class DoctorLeaveDto {

    private Long id;
    private Long doctorId;
    private LocalDate leaveDate;
    private String reason;
    private String status = "APPROVED";

    public DoctorLeaveDto() {
    }

    public DoctorLeaveDto(Long id, Long doctorId, LocalDate leaveDate, String reason, String status) {
        this.id = id;
        this.doctorId = doctorId;
        this.leaveDate = leaveDate;
        this.reason = reason;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getLeaveDate() {
        return leaveDate;
    }

    public void setLeaveDate(LocalDate leaveDate) {
        this.leaveDate = leaveDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
