package com.hospital.op.service;

import com.hospital.op.dto.AdminStatsDto;
import com.hospital.op.entity.AppointmentStatus;
import com.hospital.op.entity.Patient;
import com.hospital.op.entity.Role;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.AppointmentRepository;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.PatientRepository;
import com.hospital.op.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminStatsDto getDashboardStats() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = patientRepository.count();
        LocalDate today = LocalDate.now();

        long todayOpCount = appointmentRepository.countByAppointmentDate(today);
        long todayCompletedCount = appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.COMPLETED)
                + appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.VISITED);
        long todayPendingCount = appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.CONFIRMED)
                + appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.WAITING);

        long activeDoctors = doctorRepository.findByStatus("ACTIVE").size();

        return new AdminStatsDto(
                totalDoctors,
                totalPatients,
                todayOpCount,
                activeDoctors,
                todayCompletedCount,
                todayPendingCount
        );
    }

    public List<Map<String, Object>> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("name", p.getUser() != null ? p.getUser().getName() : "Patient");
                    map.put("email", p.getUser() != null ? p.getUser().getEmail() : "");
                    map.put("phone", p.getUser() != null ? p.getUser().getPhone() : "");
                    map.put("status", p.getUser() != null ? p.getUser().getStatus() : "ACTIVE");
                    map.put("age", p.getAge());
                    map.put("gender", p.getGender());
                    map.put("address", p.getAddress());
                    map.put("bloodGroup", p.getBloodGroup());
                    map.put("createdAt", p.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void updatePatientStatus(Long patientId, String status) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));
        if (p.getUser() != null) {
            p.getUser().setStatus(status);
            userRepository.save(p.getUser());
        }
    }
}
