package com.hospital.op.service;

import com.hospital.op.dto.SlotAvailabilityResponse;
import com.hospital.op.dto.TimeSlotDto;
import com.hospital.op.entity.AppointmentStatus;
import com.hospital.op.entity.Doctor;
import com.hospital.op.entity.DoctorLeave;
import com.hospital.op.entity.DoctorSchedule;
import com.hospital.op.exception.ResourceNotFoundException;
import com.hospital.op.repository.AppointmentRepository;
import com.hospital.op.repository.DoctorLeaveRepository;
import com.hospital.op.repository.DoctorRepository;
import com.hospital.op.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AvailabilityService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private DoctorLeaveRepository leaveRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    public SlotAvailabilityResponse getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        String doctorName = doctor.getUser() != null ? doctor.getUser().getName() : "Doctor";
        String dateStr = date.toString();

        // 1. Check if Doctor is active
        if (!"ACTIVE".equalsIgnoreCase(doctor.getStatus())) {
            return new SlotAvailabilityResponse(false, "Doctor is currently inactive.", doctorName, dateStr, new ArrayList<>());
        }

        // 2. Check if Doctor is on Leave on this date
        Optional<DoctorLeave> leaveOpt = leaveRepository.findByDoctorIdAndLeaveDateAndStatus(doctorId, date, "APPROVED");
        if (leaveOpt.isPresent()) {
            String reason = leaveOpt.get().getReason() != null ? " (" + leaveOpt.get().getReason() + ")" : "";
            return new SlotAvailabilityResponse(false, "Doctor is on leave on " + dateStr + reason, doctorName, dateStr, new ArrayList<>());
        }

        // 3. Get Day of Week Schedule
        String dayOfWeek = date.getDayOfWeek().name();
        Optional<DoctorSchedule> scheduleOpt = scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        if (scheduleOpt.isEmpty() || !scheduleOpt.get().getActive()) {
            return new SlotAvailabilityResponse(false, "Doctor does not have consultation hours on " + dayOfWeek + "s.", doctorName, dateStr, new ArrayList<>());
        }

        DoctorSchedule schedule = scheduleOpt.get();
        LocalTime current = schedule.getStartTime();
        LocalTime end = schedule.getEndTime();
        int slotDuration = schedule.getSlotDurationMinutes() > 0 ? schedule.getSlotDurationMinutes() : 30;
        int maxCapacity = schedule.getMaxPatientsPerSlot() > 0 ? schedule.getMaxPatientsPerSlot() : 3;

        List<TimeSlotDto> slots = new ArrayList<>();

        while (current.plusMinutes(slotDuration).compareTo(end) <= 0 || current.isBefore(end)) {
            String slotTimeFormatted = current.format(TIME_FORMATTER);

            // Count bookings for this exact slot on this date
            long bookedCount = appointmentRepository.countByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    doctorId,
                    date,
                    slotTimeFormatted,
                    AppointmentStatus.CANCELLED
            );

            boolean isAvailable = bookedCount < maxCapacity;

            slots.add(new TimeSlotDto(slotTimeFormatted, isAvailable, bookedCount, maxCapacity));

            current = current.plusMinutes(slotDuration);
            if (current.equals(end) || current.isAfter(end)) {
                break;
            }
        }

        return new SlotAvailabilityResponse(true, "Available slots loaded successfully.", doctorName, dateStr, slots);
    }
}
