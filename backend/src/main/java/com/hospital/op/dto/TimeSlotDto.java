package com.hospital.op.dto;

public class TimeSlotDto {

    private String time; // "10:00 AM"
    private boolean available;
    private long bookedCount;
    private int maxCapacity;

    public TimeSlotDto() {
    }

    public TimeSlotDto(String time, boolean available, long bookedCount, int maxCapacity) {
        this.time = time;
        this.available = available;
        this.bookedCount = bookedCount;
        this.maxCapacity = maxCapacity;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public long getBookedCount() {
        return bookedCount;
    }

    public void setBookedCount(long bookedCount) {
        this.bookedCount = bookedCount;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}
