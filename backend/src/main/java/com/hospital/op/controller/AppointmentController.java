package com.hospital.op.controller;

import com.hospital.op.dto.AppointmentBookingRequest;
import com.hospital.op.dto.AppointmentResponseDto;
import com.hospital.op.dto.AppointmentStatusUpdateRequest;
import com.hospital.op.dto.SlotAvailabilityResponse;
import com.hospital.op.service.AppointmentService;
import com.hospital.op.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AvailabilityService availabilityService;

    // 1. Live Available Slots Matrix
    @GetMapping("/slots")
    public ResponseEntity<SlotAvailabilityResponse> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(availabilityService.getAvailableSlots(doctorId, date));
    }

    // 2. Book OP Registration
    @PostMapping
    public ResponseEntity<AppointmentResponseDto> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request,
            Authentication authentication
    ) {
        String authEmail = authentication != null ? authentication.getName() : null;
        AppointmentResponseDto response = appointmentService.bookAppointment(request, authEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 3. Get Single by ID
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    // 4. Get Single by OP Number (e.g. OP-2026-000125)
    @GetMapping("/op/{opNumber}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentByOpNumber(@PathVariable String opNumber) {
        return ResponseEntity.ok(appointmentService.getAppointmentByOpNumber(opNumber));
    }

    // 5. Patient Appointments
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponseDto>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    // 6. Doctor Appointments / Queue
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponseDto>> getDoctorAppointments(
            @PathVariable Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId, date));
    }

    // 7. Master List for Admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(doctorId, departmentId, date, status));
    }

    // 8. Update Appointment Status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<AppointmentResponseDto> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody AppointmentStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request));
    }

    // 9. Cancel Appointment
    @PostMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Patient requested cancellation";
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
    }
}
