package com.hospital.op.dto;

public class DepartmentDto {

    private Long id;
    private String name;
    private String description;
    private String icon;
    private String status;
    private Integer doctorCount;

    public DepartmentDto() {
    }

    public DepartmentDto(Long id, String name, String description, String icon, String status, Integer doctorCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.status = status;
        this.doctorCount = doctorCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDoctorCount() {
        return doctorCount;
    }

    public void setDoctorCount(Integer doctorCount) {
        this.doctorCount = doctorCount;
    }
}
