package com.hospital.op.service;

import com.hospital.op.dto.AuthResponse;
import com.hospital.op.dto.LoginRequest;
import com.hospital.op.dto.RegisterPatientRequest;
import com.hospital.op.entity.Doctor;
import com.hospital.op.entity.Patient;
import com.hospital.op.entity.Role;
import com.hospital.op.entity.User;
import com.hospital.op.exception.BadRequestException;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.PatientRepository;
import com.hospital.op.repository.UserRepository;
import com.hospital.op.security.CustomUserDetails;
import com.hospital.op.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        Long patientId = null;
        Long doctorId = null;
        String doctorCode = null;
        String specialization = null;

        if (user.getRole() == Role.ROLE_PATIENT) {
            Optional<Patient> patientOpt = patientRepository.findByUserId(user.getId());
            if (patientOpt.isPresent()) {
                patientId = patientOpt.get().getId();
            }
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            Optional<Doctor> doctorOpt = doctorRepository.findByUserId(user.getId());
            if (doctorOpt.isPresent()) {
                doctorId = doctorOpt.get().getId();
                doctorCode = doctorOpt.get().getDoctorId();
                specialization = doctorOpt.get().getSpecialization();
            }
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                patientId,
                doctorId,
                doctorCode,
                specialization
        );
    }

    @Transactional
    public AuthResponse registerPatient(RegisterPatientRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email address is already in use.");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setRole(Role.ROLE_PATIENT);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setDateOfBirth(req.getDateOfBirth());
        patient.setAge(req.getAge());
        patient.setGender(req.getGender());
        patient.setAddress(req.getAddress());
        patient.setBloodGroup(req.getBloodGroup());
        patient.setEmergencyContact(req.getEmergencyContact());

        Patient savedPatient = patientRepository.save(patient);

        // Auto-login
        LoginRequest loginReq = new LoginRequest(req.getEmail(), req.getPassword(), "ROLE_PATIENT");
        return login(loginReq);
    }
}
