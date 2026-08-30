package com.hospital.op.dto;

public class DoctorScheduleDto {

    private Long id;
    private Long doctorId;
    private String dayOfWeek;
    private String startTime; // "HH:mm"
    private String endTime;   // "HH:mm"
    private Integer slotDurationMinutes = 30;
    private Integer maxPatientsPerSlot = 3;
    private Boolean active = true;

    public DoctorScheduleDto() {
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

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Integer getSlotDurationMinutes() {
        return slotDurationMinutes;
    }

    public void setSlotDurationMinutes(Integer slotDurationMinutes) {
        this.slotDurationMinutes = slotDurationMinutes;
    }

    public Integer getMaxPatientsPerSlot() {
        return maxPatientsPerSlot;
    }

    public void setMaxPatientsPerSlot(Integer maxPatientsPerSlot) {
        this.maxPatientsPerSlot = maxPatientsPerSlot;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
