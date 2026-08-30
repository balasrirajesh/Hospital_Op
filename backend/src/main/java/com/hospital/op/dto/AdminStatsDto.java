package com.hospital.op.dto;

public class AdminStatsDto {

    private long totalDoctors;
    private long totalPatients;
    private long todayOpCount;
    private long todayAvailableDoctors;
    private long todayCompletedCount;
    private long pendingAppointments;

    public AdminStatsDto() {
    }

    public AdminStatsDto(long totalDoctors, long totalPatients, long todayOpCount, long todayAvailableDoctors, long todayCompletedCount, long pendingAppointments) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.todayOpCount = todayOpCount;
        this.todayAvailableDoctors = todayAvailableDoctors;
        this.todayCompletedCount = todayCompletedCount;
        this.pendingAppointments = pendingAppointments;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTodayOpCount() {
        return todayOpCount;
    }

    public void setTodayOpCount(long todayOpCount) {
        this.todayOpCount = todayOpCount;
    }

    public long getTodayAvailableDoctors() {
        return todayAvailableDoctors;
    }

    public void setTodayAvailableDoctors(long todayAvailableDoctors) {
        this.todayAvailableDoctors = todayAvailableDoctors;
    }

    public long getTodayCompletedCount() {
        return todayCompletedCount;
    }

    public void setTodayCompletedCount(long todayCompletedCount) {
        this.todayCompletedCount = todayCompletedCount;
    }

    public long getPendingAppointments() {
        return pendingAppointments;
    }

    public void setPendingAppointments(long pendingAppointments) {
        this.pendingAppointments = pendingAppointments;
    }
}
