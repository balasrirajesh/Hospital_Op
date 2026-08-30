package com.hospital.op.service;

import com.hospital.op.dto.DoctorLeaveDto;
import com.hospital.op.dto.DoctorScheduleDto;
import com.hospital.op.entity.Doctor;
import com.hospital.op.entity.DoctorLeave;
import com.hospital.op.entity.DoctorSchedule;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.DoctorLeaveRepository;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private DoctorLeaveRepository leaveRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorScheduleDto> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId).stream()
                .map(this::mapScheduleToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<DoctorScheduleDto> updateDoctorSchedules(Long doctorId, List<DoctorScheduleDto> scheduleDtos) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        for (DoctorScheduleDto dto : scheduleDtos) {
            Optional<DoctorSchedule> existingOpt = scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dto.getDayOfWeek());
            DoctorSchedule schedule = existingOpt.orElse(new DoctorSchedule());
            
            schedule.setDoctor(doctor);
            schedule.setDayOfWeek(dto.getDayOfWeek().toUpperCase());
            
            if (dto.getStartTime() != null) {
                schedule.setStartTime(LocalTime.parse(dto.getStartTime()));
            }
            if (dto.getEndTime() != null) {
                schedule.setEndTime(LocalTime.parse(dto.getEndTime()));
            }
            if (dto.getSlotDurationMinutes() != null) {
                schedule.setSlotDurationMinutes(dto.getSlotDurationMinutes());
            }
            if (dto.getMaxPatientsPerSlot() != null) {
                schedule.setMaxPatientsPerSlot(dto.getMaxPatientsPerSlot());
            }
            if (dto.getActive() != null) {
                schedule.setActive(dto.getActive());
            }

            scheduleRepository.save(schedule);
        }

        return getDoctorSchedules(doctorId);
    }

    public List<DoctorLeaveDto> getDoctorLeaves(Long doctorId) {
        return leaveRepository.findByDoctorId(doctorId).stream()
                .map(l -> new DoctorLeaveDto(l.getId(), l.getDoctor().getId(), l.getLeaveDate(), l.getReason(), l.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorLeaveDto addDoctorLeave(Long doctorId, DoctorLeaveDto leaveDto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        DoctorLeave leave = new DoctorLeave();
        leave.setDoctor(doctor);
        leave.setLeaveDate(leaveDto.getLeaveDate());
        leave.setReason(leaveDto.getReason());
        leave.setStatus("APPROVED");

        DoctorLeave saved = leaveRepository.save(leave);
        return new DoctorLeaveDto(saved.getId(), saved.getDoctor().getId(), saved.getLeaveDate(), saved.getReason(), saved.getStatus());
    }

    @Transactional
    public void deleteDoctorLeave(Long doctorId, Long leaveId) {
        leaveRepository.deleteById(leaveId);
    }

    private DoctorScheduleDto mapScheduleToDto(DoctorSchedule s) {
        DoctorScheduleDto dto = new DoctorScheduleDto();
        dto.setId(s.getId());
        dto.setDoctorId(s.getDoctor().getId());
        dto.setDayOfWeek(s.getDayOfWeek());
        dto.setStartTime(s.getStartTime().toString());
        dto.setEndTime(s.getEndTime().toString());
        dto.setSlotDurationMinutes(s.getSlotDurationMinutes());
        dto.setMaxPatientsPerSlot(s.getMaxPatientsPerSlot());
        dto.setActive(s.getActive());
        return dto;
    }
}
