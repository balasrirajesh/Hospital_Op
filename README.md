# Hospital OP (Out-Patient) Registration & Doctor Availability Management System

A modern, responsive, full-stack hospital management web application designed for outpatient registration, real-time doctor availability checking, live time-slot scheduling, and role-based access control.

---

## 🌟 Key Features

### 1. 🏥 Public & Patient Portal
- **Modern Landing Page**: Hero search, departmental directory, featured consultants, live clinic stats, and "How It Works" 5-step flow.
- **Find Specialist Doctors**: Multi-criteria search by doctor name, specialization, medical department, and consultation day of week.
- **Doctor Profile & Weekly Roster**: Detailed medical qualifications, room numbers, experience, and weekly working hours.
- **Live Time-Slot Engine**: Real-time slot availability matrix with dynamic capacity checking (🟢 Available with remaining count vs 🔴 Fully Booked).
- **Online OP Registration**: Pre-filled patient info, symptom details, and review modal before final booking.
- **Instant OP Token Generation**: Unique format `OP-YYYY-XXXXXX` generated upon confirmation.
- **Printable Consultation OP Slip**: Official slip layout with hospital header, QR/barcode visual, patient demographics, and doctor room information.
- **Patient Dashboard & History**: View upcoming consultations, filter history by status (*Confirmed*, *Waiting*, *Completed*, *Cancelled*), and cancel visits.

### 2. 👨‍⚕️ Doctor Portal
- **Doctor Login**: Separate secure authentication via Doctor ID (e.g. `DOC-101`) or email.
- **Today's OP Queue**: Real-time queue tracker with status counters (*Today's OP*, *Waiting*, *Completed*, *Cancelled*).
- **Patient Status Workflow**: One-click updates (`Waiting in OP` ➔ `Completed / Visited`).
- **Schedule & Availability Configuration**: Configure weekly consulting hours, shift start/end times, slot durations (15/20/30/45/60 mins), and max patients per slot.
- **Leave Management**: Block leave dates with reasons, automatically locking slots in the patient booking engine.
- **Doctor Profile Settings**: Update medical qualifications, room numbers, experience, and professional biographies.

### 3. 🛡️ Administrator Portal
- **Executive KPI Dashboard**: Live metrics for Total Doctors, Total Patients, Today's OP Registrations, Active Consulting Doctors, and Completed Visits.
- **Department Management**: Add, edit, inactivate, and delete clinical departments and medical divisions.
- **Doctor Directory Management**: Provision new doctors, assign department affiliations, and configure system credentials.
- **OP Registrations Master Registry**: Search by OP Number or patient name, filter by doctor/department/date/status, and update statuses.
- **Doctor Schedule Oversight**: Review all doctors' weekly rosters and approved leave calendars.
- **Patient Records**: Search patient profiles and activate/deactivate accounts.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons, Canvas Confetti, Modern Medical CSS System |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security 6, JWT (`jjwt 0.11.5`), Spring Data JPA, Hibernate, Maven |
| **Database** | MySQL (with H2 embedded fallback for instant zero-config startup) |
| **Architecture** | Layered Backend (`controller`, `service`, `repository`, `entity`, `dto`, `security`, `exception`, `config`) |

---

## 🔑 Demo Login Credentials

The application automatically seeds realistic demo data on initial startup:

| Role | Email / Login ID | Password | Profile / Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `admin123` | Hospital Administrator (Full Control) |
| **Doctor** | `doctor.ravi@hospital.com` *(or `DOC-101`)* | `doctor123` | Dr. Ravi Kumar (Senior Cardiologist) |
| **Doctor** | `doctor.priya@hospital.com` *(or `DOC-102`)* | `doctor123` | Dr. Priya Sharma (Neurologist) |
| **Doctor** | `doctor.anand@hospital.com` *(or `DOC-103`)* | `doctor123` | Dr. Anand Verma (Orthopedic Surgeon) |
| **Patient** | `patient@hospital.com` | `patient123` | Ravi Kumar (Registered Patient) |

> 💡 **Tip**: The login page (`/login`) includes **1-Click Demo Login Buttons** to immediately autofill credentials for each role.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Java 17+** (JDK 17 or higher)
- **Maven** (3.8+)
- *(Optional)* **MySQL** (Default configuration runs with embedded H2 database for instant testing)

---

### Step 1: Start Backend (Spring Boot)

Open a terminal in the `backend/` directory:

```powershell
# Set Java and Maven environment (if using local portable tools):
$env:JAVA_HOME = "C:\Users\lokes\.tools\jdk17"
$env:Path = "$env:JAVA_HOME\bin;C:\Users\lokes\.tools\maven\bin;" + $env:Path

# Run Spring Boot backend:
mvn spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.
- REST API Base URL: `http://localhost:8080/api`
- H2 Console (Optional): `http://localhost:8080/h2-console` *(JDBC URL: `jdbc:h2:file:./data/hospital_db`)*

---

### Step 2: Start Frontend (React + Vite)

Open a second terminal in the `frontend/` directory:

```powershell
# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

Open your browser and navigate to: **`http://localhost:5173/`**

---

## 🗄️ MySQL Database Setup (Optional)

To connect directly to a dedicated MySQL database instead of the embedded engine:

1. Create a MySQL database:
   ```sql
   CREATE DATABASE hospital_op_db;
   ```
2. In `backend/src/main/resources/application.properties` (or run with `--spring.profiles.active=mysql`), configure your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospital_op_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.jpa.hibernate.ddl-auto=update
   ```

---

## 📚 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Login for Patient, Doctor, or Admin (returns JWT token)
- `POST /api/auth/register/patient` — Register a new patient account

### Departments (`/api/departments`)
- `GET /api/departments` — List all medical departments
- `GET /api/departments/{id}` — Get single department
- `POST /api/departments` — Create department *(Admin only)*
- `PUT /api/departments/{id}` — Update department *(Admin only)*
- `DELETE /api/departments/{id}` — Inactivate department *(Admin only)*

### Doctors (`/api/doctors`)
- `GET /api/doctors` — Search doctors (supports `departmentId`, `search`, `dayOfWeek`)
- `GET /api/doctors/{id}` — Get doctor details & bio
- `GET /api/doctors/department/{id}` — List doctors by department
- `PUT /api/doctors/{id}` — Update doctor profile *(Doctor/Admin)*
- `GET /api/doctors/{id}/schedules` — Get doctor weekly schedule
- `PUT /api/doctors/{id}/schedules` — Update doctor schedule *(Doctor/Admin)*
- `GET /api/doctors/{id}/leaves` — Get doctor leave dates
- `POST /api/doctors/{id}/leaves` — Mark leave date *(Doctor/Admin)*
- `DELETE /api/doctors/{id}/leaves/{leaveId}` — Remove leave *(Doctor/Admin)*

### Appointments & OP Engine (`/api/appointments`)
- `GET /api/appointments/slots` — Get live time slots with available capacity (`?doctorId=1&date=2026-08-31`)
- `POST /api/appointments` — Register for OP (returns unique OP Number e.g. `OP-2026-XXXXXX`)
- `GET /api/appointments/{id}` — Get appointment details
- `GET /api/appointments/op/{opNumber}` — Look up appointment by OP Number
- `GET /api/appointments/patient/{patientId}` — Get patient consultation history *(Patient/Admin)*
- `GET /api/appointments/doctor/{doctorId}` — Get doctor consultation queue (`?date=YYYY-MM-DD`) *(Doctor/Admin)*
- `GET /api/appointments` — Master filterable appointments list *(Admin only)*
- `PUT /api/appointments/{id}/status` — Update consultation status *(Doctor/Admin)*
- `POST /api/appointments/{id}/cancel` — Cancel appointment *(Patient/Doctor/Admin)*

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Get hospital-wide KPI counts
- `GET /api/admin/patients` — List registered patient accounts
- `PUT /api/admin/patients/{id}/status` — Toggle patient account status
- `POST /api/admin/doctors` — Provision new doctor with credentials
- `PUT /api/admin/doctors/{id}/status` — Toggle doctor active status

---

## 🧪 Verified User Workflows

1. **Patient Registration & OP Booking Flow**:
   - Navigate to `/register` ➔ Enter patient details ➔ Sign in.
   - Go to `/doctors` ➔ Filter by department ➔ Click **Register for OP**.
   - Pick date & choose an available time slot (🟢) ➔ Enter symptoms ➔ Click **Confirm OP Registration**.
   - Instant generation of unique **OP Number** (e.g. `OP-2026-404932`) with printable OP slip.
2. **Doctor Live Queue Flow**:
   - Sign in as `doctor.ravi@hospital.com` / `doctor123`.
   - Access **Today's OP Queue** ➔ Inspect patient clinical records ➔ Mark as **Waiting** or **Completed**.
   - Navigate to **Timings & Slots** to adjust consultation shifts and record leaves.
3. **Admin Management Flow**:
   - Sign in as `admin@hospital.com` / `admin123`.
   - Monitor real-time hospital KPIs ➔ Manage departments ➔ Add doctors ➔ Audit master OP registrations.
