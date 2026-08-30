package com.hospital.op.config;

import com.hospital.op.entity.*;
import com.hospital.op.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private DoctorLeaveRepository leaveRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println(">>> Database already initialized with demo data.");
            return;
        }

        System.out.println(">>> Initializing Hospital OP Database with realistic demo data...");

        // 1. Create Admin Account
        User adminUser = new User();
        adminUser.setName("Hospital Administrator");
        adminUser.setEmail("admin@hospital.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setPhone("+1 (800) 456-7890");
        adminUser.setRole(Role.ROLE_ADMIN);
        adminUser.setStatus("ACTIVE");
        userRepository.save(adminUser);

        // 2. Create Patient Account (Ravi Kumar)
        User patientUser = new User();
        patientUser.setName("Ravi Kumar");
        patientUser.setEmail("patient@hospital.com");
        patientUser.setPassword(passwordEncoder.encode("patient123"));
        patientUser.setPhone("+1 (555) 019-2834");
        patientUser.setRole(Role.ROLE_PATIENT);
        patientUser.setStatus("ACTIVE");
        User savedPatientUser = userRepository.save(patientUser);

        Patient patient = new Patient();
        patient.setUser(savedPatientUser);
        patient.setDateOfBirth(LocalDate.of(1994, 8, 30));
        patient.setAge(32);
        patient.setGender("Male");
        patient.setAddress("42 Healthcare Way, Apt 3B, City Center");
        patient.setBloodGroup("O+");
        patient.setEmergencyContact("+1 (555) 998-1122");
        Patient savedPatient = patientRepository.save(patient);

        // 3. Create Departments
        Department cardio = createDept("Cardiology", "Specialized cardiac assessments, ECG, 2D Echo, preventive cardiology, and adult heart care.", "Heart");
        Department neuro = createDept("Neurology", "Advanced diagnosis of neurological disorders, stroke rehabilitation, headache clinic, and EEG.", "Brain");
        Department ortho = createDept("Orthopedics", "Joint replacements, spine care, arthroscopy, sports injury rehabilitation, and fracture clinic.", "Bone");
        Department genMed = createDept("General Medicine", "Primary outpatient care, routine health screenings, hypertension, diabetes, and infectious disease management.", "Activity");
        Department peds = createDept("Pediatrics", "Comprehensive child wellness, neonatal follow-up, immunization programs, and pediatric emergency triage.", "Baby");
        Department derma = createDept("Dermatology", "Medical skin treatments, allergy management, laser aesthetics, and clinical dermatology consultations.", "Sparkles");
        Department ent = createDept("ENT", "Ear, nose, and throat diagnostics, audiology testing, sinus care, and head & neck consultations.", "Ear");
        Department ophthal = createDept("Ophthalmology", "Comprehensive eye examinations, cataract care, vision therapy, and diabetic retinopathy screenings.", "Eye");
        Department gastro = createDept("Gastroenterology", "Digestive health, endoscopy, liver clinic, and irritable bowel management.", "UtensilsCrossed");
        Department pulmon = createDept("Pulmonology", "Asthma, COPD, lung function tests, sleep apnea assessments, and respiratory care.", "Wind");
        Department uro = createDept("Urology", "Kidney stone care, prostate clinic, and urinary tract health management.", "Droplet");
        Department psych = createDept("Psychiatry", "Behavioral health, stress management, counseling, and psychotherapy.", "Brain");

        // 4. Create Specialist Doctors
        Doctor doc1 = createDoctor(
                "Dr. Ravi Kumar",
                "doctor.ravi@hospital.com",
                "doctor123",
                "+1 (555) 123-4567",
                "DOC-101",
                "MBBS, MD (Cardiology)",
                "Cardiologist",
                12,
                cardio,
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
                "Room 102 (Cardio OP Wing)",
                "Senior Cardiologist with extensive expertise in preventive cardiology and clinical heart disease management."
        );

        Doctor doc2 = createDoctor(
                "Dr. Priya Sharma",
                "doctor.priya@hospital.com",
                "doctor123",
                "+1 (555) 234-5678",
                "DOC-102",
                "MBBS, MD, DM (Neurology)",
                "Neurologist",
                10,
                neuro,
                "https://images.unsplash.com/photo-1594824813689-f53816a75a7c?w=200&auto=format&fit=crop&q=80",
                "Room 204 (Neuro Wing)",
                "Consultant Neurologist specializing in headache disorders, epilepsy, and peripheral neuropathy."
        );

        Doctor doc3 = createDoctor(
                "Dr. Anand Verma",
                "doctor.anand@hospital.com",
                "doctor123",
                "+1 (555) 345-6789",
                "DOC-103",
                "MBBS, MS (Orthopedics), MCh",
                "Orthopedic Surgeon",
                15,
                ortho,
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
                "Room 108 (Ortho Wing)",
                "Joint replacement surgeon with over 15 years of surgical experience in knee and hip arthroplasty."
        );

        Doctor doc4 = createDoctor(
                "Dr. Sunita Rao",
                "doctor.sunita@hospital.com",
                "doctor123",
                "+1 (555) 456-7890",
                "DOC-104",
                "MBBS, DCH, MD (Pediatrics)",
                "Pediatrician",
                8,
                peds,
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
                "Room 110 (Child Health Wing)",
                "Pediatric specialist focused on newborn growth tracking, adolescent health, and pediatric immunity."
        );

        Doctor doc5 = createDoctor(
                "Dr. Rajesh Gupta",
                "doctor.rajesh@hospital.com",
                "doctor123",
                "+1 (555) 567-8901",
                "DOC-105",
                "MBBS, MD (General Medicine)",
                "Senior Physician",
                14,
                genMed,
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80",
                "Room 101 (Main OP Wing)",
                "Chief of General Medicine managing metabolic disorders, chronic illnesses, and preventative wellness."
        );

        Doctor doc6 = createDoctor(
                "Dr. Vikram Malhotra",
                "doctor.vikram@hospital.com",
                "doctor123",
                "+1 (555) 678-9012",
                "DOC-106",
                "MBBS, MD (Dermatology)",
                "Dermatologist & Cosmetologist",
                9,
                derma,
                "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=200&auto=format&fit=crop&q=80",
                "Room 206 (Derma Wing)",
                "Expert dermatologist treating allergic dermatitis, psoriasis, acne management, and aesthetic dermatology."
        );

        // 5. Setup Weekly Schedules for all doctors
        List<Doctor> allDocs = Arrays.asList(doc1, doc2, doc3, doc4, doc5, doc6);
        for (Doctor doc : allDocs) {
            createStandardSchedule(doc);
        }

        // 6. Setup Sample OP Appointments for Demonstration
        LocalDate today = LocalDate.now();

        createAppointment(
                "OP-2026-000101",
                savedPatient,
                "Ravi Kumar",
                32,
                "Male",
                "+1 (555) 019-2834",
                doc1,
                cardio,
                today,
                "10:00 AM",
                "Routine Cardiac Checkup",
                "Mild chest discomfort during brisk walking",
                AppointmentStatus.WAITING
        );

        createAppointment(
                "OP-2026-000102",
                null,
                "Suresh Kumar",
                45,
                "Male",
                "+1 (555) 443-8899",
                doc1,
                cardio,
                today,
                "10:30 AM",
                "High Blood Pressure Review",
                "Headache and elevated systolic pressure",
                AppointmentStatus.WAITING
        );

        createAppointment(
                "OP-2026-000103",
                null,
                "Priya Sharma",
                29,
                "Female",
                "+1 (555) 776-3322",
                doc1,
                cardio,
                today,
                "11:00 AM",
                "Post-treatment follow up",
                "Regular follow up after medication",
                AppointmentStatus.COMPLETED
        );

        createAppointment(
                "OP-2026-000104",
                savedPatient,
                "Ravi Kumar",
                32,
                "Male",
                "+1 (555) 019-2834",
                doc3,
                ortho,
                today.plusDays(2),
                "11:30 AM",
                "Knee Pain Assessment",
                "Stiffness and clicking sound in right knee after running",
                AppointmentStatus.CONFIRMED
        );

        System.out.println(">>> Demo data initialization completed successfully.");
    }

    private Department createDept(String name, String desc, String icon) {
        Department d = new Department();
        d.setName(name);
        d.setDescription(desc);
        d.setIcon(icon);
        d.setStatus("ACTIVE");
        return departmentRepository.save(d);
    }

    private Doctor createDoctor(String name, String email, String password, String phone, String docCode, String qual, String spec, int exp, Department dept, String img, String room, String bio) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole(Role.ROLE_DOCTOR);
        user.setStatus("ACTIVE");
        User savedUser = userRepository.save(user);

        Doctor doc = new Doctor();
        doc.setUser(savedUser);
        doc.setDoctorId(docCode);
        doc.setQualification(qual);
        doc.setSpecialization(spec);
        doc.setExperience(exp);
        doc.setDepartment(dept);
        doc.setProfileImage(img);
        doc.setRoomNumber(room);
        doc.setBio(bio);
        doc.setStatus("ACTIVE");
        return doctorRepository.save(doc);
    }

    private void createStandardSchedule(Doctor doctor) {
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"};
        for (String day : days) {
            DoctorSchedule s = new DoctorSchedule();
            s.setDoctor(doctor);
            s.setDayOfWeek(day);
            s.setStartTime(LocalTime.of(10, 0));
            s.setEndTime(LocalTime.of(13, 0));
            s.setSlotDurationMinutes(30);
            s.setMaxPatientsPerSlot(3);
            s.setActive(true);
            scheduleRepository.save(s);
        }
    }

    private void createAppointment(String opNo, Patient patient, String patName, int age, String gender, String phone, Doctor doctor, Department dept, LocalDate date, String time, String reason, String symptoms, AppointmentStatus status) {
        Appointment a = new Appointment();
        a.setOpNumber(opNo);
        a.setPatient(patient);
        a.setPatientName(patName);
        a.setPatientAge(age);
        a.setPatientGender(gender);
        a.setPatientPhone(phone);
        a.setDoctor(doctor);
        a.setDepartment(dept);
        a.setAppointmentDate(date);
        a.setAppointmentTime(time);
        a.setReason(reason);
        a.setSymptoms(symptoms);
        a.setStatus(status);
        appointmentRepository.save(a);
    }
}
