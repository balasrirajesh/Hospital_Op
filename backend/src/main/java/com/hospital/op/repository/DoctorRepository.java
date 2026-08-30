package com.hospital.op.repository;

import com.hospital.op.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(String doctorId);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByDepartmentId(Long departmentId);
    List<Doctor> findByStatus(String status);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:departmentId IS NULL OR d.department.id = :departmentId) AND " +
           "(:status IS NULL OR d.status = :status) AND " +
           "(:search IS NULL OR LOWER(d.user.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(d.specialization) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(d.doctorId) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Doctor> searchDoctors(@Param("departmentId") Long departmentId,
                               @Param("status") String status,
                               @Param("search") String search);
}
