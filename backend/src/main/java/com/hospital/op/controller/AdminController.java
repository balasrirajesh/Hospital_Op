package com.hospital.op.controller;

import com.hospital.op.dto.AdminStatsDto;
import com.hospital.op.dto.DoctorCreateRequest;
import com.hospital.op.dto.DoctorDto;
import com.hospital.op.service.AdminService;
import com.hospital.op.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @PutMapping("/patients/{id}/status")
    public ResponseEntity<Void> updatePatientStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "ACTIVE");
        adminService.updatePatientStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorDto> createDoctor(@Valid @RequestBody DoctorCreateRequest request) {
        DoctorDto created = doctorService.createDoctor(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/doctors/{id}/status")
    public ResponseEntity<Void> updateDoctorStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "ACTIVE");
        doctorService.updateDoctorStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
