package com.hospital.op.service;

import com.hospital.op.dto.AppointmentBookingRequest;
import com.hospital.op.dto.AppointmentResponseDto;
import com.hospital.op.dto.AppointmentStatusUpdateRequest;
import com.hospital.op.entity.*;
import com.hospital.op.exception.BadRequestException;
import com.hospital.op.exception.ConflictException;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private DoctorLeaveRepository leaveRepository;

    private static final AtomicLong OP_COUNTER = new AtomicLong(100);

    @Transactional
    public AppointmentResponseDto bookAppointment(AppointmentBookingRequest req, String authenticatedEmail) {
        // 1. Date cannot be in the past
        if (req.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past.");
        }

        // 2. Doctor existence and status
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + req.getDoctorId()));

        if (!"ACTIVE".equalsIgnoreCase(doctor.getStatus())) {
            throw new BadRequestException("Selected doctor is currently not accepting OP registrations.");
        }

        // 3. Check leave
        Optional<DoctorLeave> leave = leaveRepository.findByDoctorIdAndLeaveDateAndStatus(doctor.getId(), req.getAppointmentDate(), "APPROVED");
        if (leave.isPresent()) {
            throw new ConflictException("Doctor is on leave on " + req.getAppointmentDate() + ". Please choose another date.");
        }

        // 4. Check schedule & capacity
        String dayOfWeek = req.getAppointmentDate().getDayOfWeek().name();
        DoctorSchedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeek(doctor.getId(), dayOfWeek)
                .orElseThrow(() -> new BadRequestException("Doctor has no consultation schedule configured for " + dayOfWeek + "."));

        if (!schedule.getActive()) {
            throw new BadRequestException("Doctor is not consulting on " + dayOfWeek + "s.");
        }

        long currentBookings = appointmentRepository.countByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor.getId(),
                req.getAppointmentDate(),
                req.getAppointmentTime(),
                AppointmentStatus.CANCELLED
        );

        if (currentBookings >= schedule.getMaxPatientsPerSlot()) {
            throw new ConflictException("This time slot (" + req.getAppointmentTime() + ") is fully booked (capacity: " + schedule.getMaxPatientsPerSlot() + "). Please choose another slot.");
        }

        // 5. Patient link (if authenticated or newly supplied)
        Patient patient = null;
        if (authenticatedEmail != null) {
            patient = patientRepository.findAll().stream()
                    .filter(p -> p.getUser() != null && authenticatedEmail.equalsIgnoreCase(p.getUser().getEmail()))
                    .findFirst()
                    .orElse(null);
        }

        // 6. Department
        Department dept = null;
        if (req.getDepartmentId() != null) {
            dept = departmentRepository.findById(req.getDepartmentId()).orElse(doctor.getDepartment());
        } else {
            dept = doctor.getDepartment();
        }

        // 7. Create Appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setPatientName(req.getPatientName());
        appointment.setPatientAge(req.getPatientAge());
        appointment.setPatientGender(req.getPatientGender());
        appointment.setPatientPhone(req.getPatientPhone());
        appointment.setPatientAddress(req.getPatientAddress());
        
        appointment.setDoctor(doctor);
        appointment.setDepartment(dept);
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setAppointmentTime(req.getAppointmentTime());
        appointment.setReason(req.getReason());
        appointment.setSymptoms(req.getSymptoms());
        appointment.setPreviousMedicalHistory(req.getPreviousMedicalHistory());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        // Generate Unique OP Number: OP-YYYY-XXXXXX (e.g. OP-2026-000125)
        int year = req.getAppointmentDate().getYear();
        long uniqueSequence = (System.currentTimeMillis() % 900000) + 100000;
        String formattedOpNumber = String.format("OP-%d-%06d", year, uniqueSequence);
        appointment.setOpNumber(formattedOpNumber);

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDto(saved);
    }

    public AppointmentResponseDto getAppointmentById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return mapToDto(appt);
    }

    public AppointmentResponseDto getAppointmentByOpNumber(String opNumber) {
        Appointment appt = appointmentRepository.findByOpNumber(opNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with OP Number: " + opNumber));
        return mapToDto(appt);
    }

    public List<AppointmentResponseDto> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescCreatedAtDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getDoctorAppointments(Long doctorId, LocalDate date) {
        if (date != null) {
            return appointmentRepository.findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(doctorId, date).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescCreatedAtDesc(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAllAppointments(Long doctorId, Long departmentId, LocalDate date, String status) {
        AppointmentStatus apptStatus = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try {
                apptStatus = AppointmentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        return appointmentRepository.filterAppointments(doctorId, departmentId, date, apptStatus).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponseDto updateStatus(Long id, AppointmentStatusUpdateRequest req) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        try {
            AppointmentStatus newStatus = AppointmentStatus.valueOf(req.getStatus().toUpperCase());
            appt.setStatus(newStatus);
            if (req.getReason() != null) {
                appt.setCancellationReason(req.getReason());
            }
            Appointment updated = appointmentRepository.save(appt);
            return mapToDto(updated);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + req.getStatus());
        }
    }

    @Transactional
    public AppointmentResponseDto cancelAppointment(Long id, String reason) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        if (appt.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed consultation.");
        }

        appt.setStatus(AppointmentStatus.CANCELLED);
        if (reason != null && !reason.isBlank()) {
            appt.setCancellationReason(reason);
        }

        Appointment updated = appointmentRepository.save(appt);
        return mapToDto(updated);
    }

    public AppointmentResponseDto mapToDto(Appointment a) {
        AppointmentResponseDto dto = new AppointmentResponseDto();
        dto.setId(a.getId());
        dto.setOpNumber(a.getOpNumber());
        dto.setPatientName(a.getPatientName());
        dto.setPatientAge(a.getPatientAge());
        dto.setPatientGender(a.getPatientGender());
        dto.setPatientPhone(a.getPatientPhone());
        dto.setPatientAddress(a.getPatientAddress());
        dto.setAppointmentDate(a.getAppointmentDate());
        dto.setAppointmentTime(a.getAppointmentTime());
        dto.setReason(a.getReason());
        dto.setSymptoms(a.getSymptoms());
        dto.setPreviousMedicalHistory(a.getPreviousMedicalHistory());
        dto.setStatus(a.getStatus().name());
        dto.setCancellationReason(a.getCancellationReason());
        dto.setCreatedAt(a.getCreatedAt());

        if (a.getPatient() != null) {
            dto.setPatientId(a.getPatient().getId());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
            dto.setDoctorName(a.getDoctor().getUser() != null ? a.getDoctor().getUser().getName() : "Doctor");
            dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
            dto.setDoctorQualification(a.getDoctor().getQualification());
            dto.setDoctorRoomNumber(a.getDoctor().getRoomNumber());
        }

        if (a.getDepartment() != null) {
            dto.setDepartmentId(a.getDepartment().getId());
            dto.setDepartmentName(a.getDepartment().getName());
        }

        return dto;
    }
}
