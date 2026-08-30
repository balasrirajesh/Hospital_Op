package com.hospital.op.repository;

import com.hospital.op.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctorId(Long doctorId);
    Optional<DoctorSchedule> findByDoctorIdAndDayOfWeek(Long doctorId, String dayOfWeek);
    List<DoctorSchedule> findByDoctorIdAndActiveTrue(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}
