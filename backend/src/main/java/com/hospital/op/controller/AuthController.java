package com.hospital.op.controller;

import com.hospital.op.dto.AuthResponse;
import com.hospital.op.dto.LoginRequest;
import com.hospital.op.dto.RegisterPatientRequest;
import com.hospital.op.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(@Valid @RequestBody RegisterPatientRequest request) {
        AuthResponse response = authService.registerPatient(request);
        return ResponseEntity.ok(response);
    }
}
