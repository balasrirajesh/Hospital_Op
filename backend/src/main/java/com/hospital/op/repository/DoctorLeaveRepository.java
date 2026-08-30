package com.hospital.op.repository;

import com.hospital.op.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {
    List<DoctorLeave> findByDoctorId(Long doctorId);
    Optional<DoctorLeave> findByDoctorIdAndLeaveDateAndStatus(Long doctorId, LocalDate leaveDate, String status);
    List<DoctorLeave> findByDoctorIdAndLeaveDateGreaterThanEqual(Long doctorId, LocalDate fromDate);
}
