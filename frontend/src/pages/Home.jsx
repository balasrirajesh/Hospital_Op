import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { DepartmentCard } from '../components/DepartmentCard';
import { DoctorCard } from '../components/DoctorCard';
import { 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Users, 
  Activity, 
  HeartHandshake,
  FileCheck2,
  PhoneCall
} from 'lucide-react';

export const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getAllDepartments().catch(() => []),
          doctorService.getAllDoctors().catch(() => [])
        ]);
        setDepartments(deptRes);
        setFeaturedDoctors(docRes.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedDept) params.append('departmentId', selectedDept);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)',
        padding: '4rem 1.5rem 5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--primary-200)',
                color: 'var(--primary-800)',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <ShieldCheck size={16} color="var(--primary-600)" />
                <span>Verified Specialist Out-Patient (OP) Booking</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                color: '#0f172a',
                lineHeight: '1.2',
                marginBottom: '1.25rem'
              }}>
                Find the Right Doctor. <br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary-700), var(--accent-600))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Book Your OP Easily.
                </span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                Check real-time doctor availability, consultation timings, and register for your hospital OP appointment online with instant OP token generation.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <Link to="/op-registration" className="btn btn-primary btn-lg">
                  <Calendar size={20} />
                  <span>Register for OP Online</span>
                </Link>
                <Link to="/doctors" className="btn btn-secondary btn-lg">
                  <Stethoscope size={20} />
                  <span>Find Available Doctors</span>
                </Link>
              </div>

              {/* Quick Search Bar */}
              <form 
                onSubmit={handleSearchSubmit}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px', padding: '0 0.5rem' }}>
                  <Search size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search doctor or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.925rem',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)', display: 'none' }} className="search-divider" />

                <div style={{ flex: '1 1 160px' }}>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.25rem' }}>
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Right Card / Visual Showcase */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--primary-100)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Activity size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>Live OP Registration</div>
                      <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                        Doctors Currently Consulting
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-primary">Today</span>
                </div>

                {/* Sample Live Doctor Card */}
                <div style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.875rem' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" 
                      alt="Doctor" 
                      style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Dr. Ravi Kumar</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: '600' }}>Cardiologist • MD Cardiology</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>10:00 AM - 01:00 PM • Room 102</div>
                    </div>
                    <div>
                      <span className="badge badge-success">🟢 Available</span>
                    </div>
                  </div>
                </div>

                {/* Quick Process Chips */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} color="#10b981" /> No waiting in queues
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} color="#10b981" /> Instant OP Number
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} color="#10b981" /> Printable Slip
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '2rem 1.5rem' }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-700)' }}>14+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Medical Departments</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-700)' }}>45+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Specialist Doctors</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-700)' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Live Availability Tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-700)' }}>12,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Patients Registered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Simple 5-Step Process</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How OP Registration Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Register for your out-patient consultation in less than two minutes from any device.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { step: '01', title: 'Select Department', desc: 'Choose Cardiology, Neurology, Orthopedics, or any specialty.', icon: Activity },
              { step: '02', title: 'Find Doctor', desc: 'Compare doctor profiles, qualifications, and working days.', icon: Stethoscope },
              { step: '03', title: 'Pick Date & Slot', desc: 'Select an available time slot with live capacity check.', icon: Clock },
              { step: '04', title: 'Confirm Details', desc: 'Enter reason for visit and review your registration info.', icon: FileCheck2 },
              { step: '05', title: 'Get OP Slip', desc: 'Instant unique OP number with printable consultation slip.', icon: Calendar }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card" style={{ padding: '1.75rem', position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    border: '1px solid var(--primary-100)'
                  }}>
                    <Icon size={26} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    color: 'var(--primary-300)'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Departments Showcase */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Specialties</span>
              <h2 style={{ fontSize: '2.25rem' }}>Hospital Departments</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Browse our comprehensive medical divisions and specialist units.
              </p>
            </div>
            <Link to="/departments" className="btn btn-outline-primary">
              <span>View All Departments</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {departments.slice(0, 8).map((dept) => (
              <DepartmentCard key={dept.id} department={dept} doctorCount={dept.doctorCount || 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Available Doctors */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Consultants</span>
              <h2 style={{ fontSize: '2.25rem' }}>Available Specialist Doctors</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Qualified and experienced doctors ready for your consultation.
              </p>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary">
              <span>Search All Doctors</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* Emergency & Helpline Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-800), var(--primary-950))',
        color: '#ffffff',
        padding: '4rem 1.5rem'
      }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-300)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <PhoneCall size={18} />
                <span>Emergency OP Care & Helpline</span>
              </div>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                Need Immediate Medical Assistance?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6' }}>
                Our 24/7 Out-Patient emergency reception and triage desks are ready to assist you. Walk-ins are prioritized based on clinical assessment.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:18004567890" className="btn btn-primary btn-lg" style={{ backgroundColor: 'var(--primary-500)' }}>
                <PhoneCall size={18} />
                <span>Call Emergency: +1 (800) 456-7890</span>
              </a>
              <Link to="/op-registration" className="btn btn-secondary btn-lg">
                <span>Book Priority OP</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
