package com.hospital.op.dto;

import java.util.ArrayList;
import java.util.List;

public class SlotAvailabilityResponse {

    private boolean available;
    private String message;
    private String doctorName;
    private String date;
    private List<TimeSlotDto> slots = new ArrayList<>();

    public SlotAvailabilityResponse() {
    }

    public SlotAvailabilityResponse(boolean available, String message, String doctorName, String date, List<TimeSlotDto> slots) {
        this.available = available;
        this.message = message;
        this.doctorName = doctorName;
        this.date = date;
        this.slots = slots != null ? slots : new ArrayList<>();
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<TimeSlotDto> getSlots() {
        return slots;
    }

    public void setSlots(List<TimeSlotDto> slots) {
        this.slots = slots;
    }
}
