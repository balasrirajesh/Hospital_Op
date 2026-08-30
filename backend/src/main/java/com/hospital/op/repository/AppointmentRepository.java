package com.hospital.op.repository;

import com.hospital.op.entity.Appointment;
import com.hospital.op.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByOpNumber(String opNumber);

    List<Appointment> findByPatientIdOrderByAppointmentDateDescCreatedAtDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByAppointmentDateDescCreatedAtDesc(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(Long doctorId, LocalDate appointmentDate);

    // Count how many active (non-cancelled) bookings exist for a specific slot
    long countByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId,
            LocalDate appointmentDate,
            String appointmentTime,
            AppointmentStatus status
    );

    // Count appointments for today
    long countByAppointmentDate(LocalDate appointmentDate);

    // Count appointments for today by status
    long countByAppointmentDateAndStatus(LocalDate appointmentDate, AppointmentStatus status);

    // Admin multi-criteria filter
    @Query("SELECT a FROM Appointment a WHERE " +
           "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
           "(:departmentId IS NULL OR a.department.id = :departmentId) AND " +
           "(:date IS NULL OR a.appointmentDate = :date) AND " +
           "(:status IS NULL OR a.status = :status) " +
           "ORDER BY a.appointmentDate DESC, a.createdAt DESC")
    List<Appointment> filterAppointments(
            @Param("doctorId") Long doctorId,
            @Param("departmentId") Long departmentId,
            @Param("date") LocalDate date,
            @Param("status") AppointmentStatus status
    );
}
