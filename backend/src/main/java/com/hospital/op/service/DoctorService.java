package com.hospital.op.service;

import com.hospital.op.dto.DoctorCreateRequest;
import com.hospital.op.dto.DoctorDto;
import com.hospital.op.entity.Department;
import com.hospital.op.entity.Doctor;
import com.hospital.op.entity.DoctorSchedule;
import com.hospital.op.entity.Role;
import com.hospital.op.entity.User;
import com.hospital.op.exception.BadRequestException;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.DepartmentRepository;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.DoctorScheduleRepository;
import com.hospital.op.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<DoctorDto> getAllDoctors(Long departmentId, String search, String dayOfWeek) {
        List<Doctor> doctors = doctorRepository.searchDoctors(departmentId, "ACTIVE", search);

        if (dayOfWeek != null && !dayOfWeek.isBlank()) {
            String targetDay = dayOfWeek.toUpperCase();
            doctors = doctors.stream()
                    .filter(doc -> doctorScheduleRepository
                            .findByDoctorIdAndDayOfWeek(doc.getId(), targetDay)
                            .map(DoctorSchedule::getActive)
                            .orElse(false))
                    .collect(Collectors.toList());
        }

        return doctors.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return mapToDto(doctor);
    }

    public List<DoctorDto> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorDto createDoctor(DoctorCreateRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already in use by another account.");
        }
        if (doctorRepository.findByDoctorId(req.getDoctorId()).isPresent()) {
            throw new BadRequestException("Doctor ID '" + req.getDoctorId() + "' already exists.");
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + req.getDepartmentId()));

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        String rawPassword = req.getPassword() != null && !req.getPassword().isBlank() ? req.getPassword() : "doctor123";
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(req.getPhone());
        user.setRole(Role.ROLE_DOCTOR);
        user.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");

        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setDoctorId(req.getDoctorId());
        doctor.setQualification(req.getQualification());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setExperience(req.getExperience());
        doctor.setDepartment(dept);
        doctor.setProfileImage(req.getProfileImage());
        doctor.setRoomNumber(req.getRoomNumber());
        doctor.setBio(req.getBio());
        doctor.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDto(savedDoctor);
    }

    @Transactional
    public DoctorDto updateDoctor(Long id, DoctorDto req) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        if (doctor.getUser() != null) {
            if (req.getName() != null) doctor.getUser().setName(req.getName());
            if (req.getPhone() != null) doctor.getUser().setPhone(req.getPhone());
            if (req.getStatus() != null) doctor.getUser().setStatus(req.getStatus());
            userRepository.save(doctor.getUser());
        }

        if (req.getQualification() != null) doctor.setQualification(req.getQualification());
        if (req.getSpecialization() != null) doctor.setSpecialization(req.getSpecialization());
        if (req.getExperience() != null) doctor.setExperience(req.getExperience());
        if (req.getProfileImage() != null) doctor.setProfileImage(req.getProfileImage());
        if (req.getRoomNumber() != null) doctor.setRoomNumber(req.getRoomNumber());
        if (req.getBio() != null) doctor.setBio(req.getBio());
        if (req.getStatus() != null) doctor.setStatus(req.getStatus());

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + req.getDepartmentId()));
            doctor.setDepartment(dept);
        }

        Doctor updated = doctorRepository.save(doctor);
        return mapToDto(updated);
    }

    @Transactional
    public void updateDoctorStatus(Long id, String status) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        doctor.setStatus(status);
        if (doctor.getUser() != null) {
            doctor.getUser().setStatus(status);
        }
        doctorRepository.save(doctor);
    }

    public DoctorDto mapToDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setDoctorId(doctor.getDoctorId());
        dto.setQualification(doctor.getQualification());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setExperience(doctor.getExperience());
        dto.setProfileImage(doctor.getProfileImage());
        dto.setRoomNumber(doctor.getRoomNumber());
        dto.setBio(doctor.getBio());
        dto.setStatus(doctor.getStatus());

        if (doctor.getUser() != null) {
            dto.setUserId(doctor.getUser().getId());
            dto.setName(doctor.getUser().getName());
            dto.setEmail(doctor.getUser().getEmail());
            dto.setPhone(doctor.getUser().getPhone());
        }

        if (doctor.getDepartment() != null) {
            dto.setDepartmentId(doctor.getDepartment().getId());
            dto.setDepartmentName(doctor.getDepartment().getName());
        }

        // Calculate schedule summaries
        List<DoctorSchedule> activeSchedules = doctorScheduleRepository.findByDoctorIdAndActiveTrue(doctor.getId());
        if (!activeSchedules.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
            DoctorSchedule first = activeSchedules.get(0);
            dto.setTimingSummary(first.getStartTime().format(formatter) + " - " + first.getEndTime().format(formatter));
            
            if (activeSchedules.size() >= 6) {
                dto.setAvailableDaysSummary("Monday - Saturday");
            } else {
                String days = activeSchedules.stream()
                        .map(s -> s.getDayOfWeek().substring(0, 3))
                        .collect(Collectors.joining(", "));
                dto.setAvailableDaysSummary(days);
            }
            
            // Check today
            String todayDay = LocalDate.now().getDayOfWeek().name();
            boolean availableToday = activeSchedules.stream().anyMatch(s -> s.getDayOfWeek().equalsIgnoreCase(todayDay));
            dto.setIsAvailableToday(availableToday);
        } else {
            dto.setTimingSummary("10:00 AM - 01:00 PM");
            dto.setAvailableDaysSummary("Monday - Friday");
            dto.setIsAvailableToday(true);
        }

        return dto;
    }
}
