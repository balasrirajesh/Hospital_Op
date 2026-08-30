package com.hospital.op.service;

import com.hospital.op.dto.DepartmentDto;
import com.hospital.op.entity.Department;
import com.hospital.op.exception.BadRequestException;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.DepartmentRepository;
import com.hospital.op.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToDto(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.findByName(dto.getName()).isPresent()) {
            throw new BadRequestException("Department with name '" + dto.getName() + "' already exists.");
        }

        Department dept = new Department();
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        dept.setIcon(dto.getIcon());
        dept.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        Department saved = departmentRepository.save(dept);
        return mapToDto(saved);
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        if (dto.getIcon() != null) dept.setIcon(dto.getIcon());
        if (dto.getStatus() != null) dept.setStatus(dto.getStatus());

        Department updated = departmentRepository.save(dept);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        
        // Soft delete / inactivate
        dept.setStatus("INACTIVE");
        departmentRepository.save(dept);
    }

    private DepartmentDto mapToDto(Department dept) {
        int docCount = doctorRepository.findByDepartmentId(dept.getId()).size();
        return new DepartmentDto(
                dept.getId(),
                dept.getName(),
                dept.getDescription(),
                dept.getIcon(),
                dept.getStatus(),
                docCount
        );
    }
}
