package com.hospital.op.security;

import com.hospital.op.entity.Doctor;
import com.hospital.op.entity.User;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmailOrDoctorId) throws UsernameNotFoundException {
        // First try direct email lookup
        Optional<User> userOptional = userRepository.findByEmail(usernameOrEmailOrDoctorId);
        if (userOptional.isPresent()) {
            return CustomUserDetails.build(userOptional.get());
        }

        // If not found, check if it's a doctorId (e.g. DOC-101)
        Optional<Doctor> doctorOptional = doctorRepository.findByDoctorId(usernameOrEmailOrDoctorId);
        if (doctorOptional.isPresent() && doctorOptional.get().getUser() != null) {
            return CustomUserDetails.build(doctorOptional.get().getUser());
        }

        throw new UsernameNotFoundException("User not found with email or Doctor ID: " + usernameOrEmailOrDoctorId);
    }
}
