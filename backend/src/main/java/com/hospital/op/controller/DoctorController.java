package com.hospital.op.controller;

import com.hospital.op.dto.DoctorDto;
import com.hospital.op.dto.DoctorLeaveDto;
import com.hospital.op.dto.DoctorScheduleDto;
import com.hospital.op.service.DoctorScheduleService;
import com.hospital.op.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String dayOfWeek
    ) {
        return ResponseEntity.ok(doctorService.getAllDoctors(departmentId, search, dayOfWeek));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<DoctorDto>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<DoctorDto> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorDto dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }

    // Doctor Schedules
    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<DoctorScheduleDto>> getDoctorSchedules(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getDoctorSchedules(id));
    }

    @PutMapping("/{id}/schedules")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<DoctorScheduleDto>> updateDoctorSchedules(
            @PathVariable Long id,
            @RequestBody List<DoctorScheduleDto> schedules
    ) {
        return ResponseEntity.ok(scheduleService.updateDoctorSchedules(id, schedules));
    }

    // Doctor Leaves
    @GetMapping("/{id}/leaves")
    public ResponseEntity<List<DoctorLeaveDto>> getDoctorLeaves(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getDoctorLeaves(id));
    }

    @PostMapping("/{id}/leaves")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<DoctorLeaveDto> addDoctorLeave(
            @PathVariable Long id,
            @RequestBody DoctorLeaveDto leaveDto
    ) {
        return ResponseEntity.ok(scheduleService.addDoctorLeave(id, leaveDto));
    }

    @DeleteMapping("/{id}/leaves/{leaveId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteDoctorLeave(
            @PathVariable Long id,
            @PathVariable Long leaveId
    ) {
        scheduleService.deleteDoctorLeave(id, leaveId);
        return ResponseEntity.noContent().build();
    }
}
