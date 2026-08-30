package com.hospital.op.dto;

public class DoctorDto {

    private Long id;
    private Long userId;
    private String doctorId;
    private String name;
    private String email;
    private String phone;
    private String qualification;
    private String specialization;
    private Integer experience;
    private Long departmentId;
    private String departmentName;
    private String profileImage;
    private String roomNumber;
    private String bio;
    private String status;
    private String availableDaysSummary;
    private String timingSummary;
    private Boolean isAvailableToday;

    public DoctorDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAvailableDaysSummary() {
        return availableDaysSummary;
    }

    public void setAvailableDaysSummary(String availableDaysSummary) {
        this.availableDaysSummary = availableDaysSummary;
    }

    public String getTimingSummary() {
        return timingSummary;
    }

    public void setTimingSummary(String timingSummary) {
        this.timingSummary = timingSummary;
    }

    public Boolean getIsAvailableToday() {
        return isAvailableToday;
    }

    public void setIsAvailableToday(Boolean isAvailableToday) {
        this.isAvailableToday = isAvailableToday;
    }
}
