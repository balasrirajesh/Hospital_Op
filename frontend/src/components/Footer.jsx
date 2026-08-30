import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#042f2e',
      color: '#e2e8f0',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div className="page-container" style={{ paddingBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                MediCare <span style={{ color: 'var(--primary-400)' }}>OP+</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Modern out-patient registration and specialist doctor availability platform. Fast, accurate, and accessible OP healthcare appointments.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-400)', fontSize: '0.85rem' }}>
              <Shield size={16} /> 24/7 OP Emergency Desk Supported
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/doctors" style={{ color: '#cbd5e1' }}>Find Specialist Doctors</Link></li>
              <li><Link to="/departments" style={{ color: '#cbd5e1' }}>Medical Departments</Link></li>
              <li><Link to="/op-registration" style={{ color: '#cbd5e1' }}>Register for OP</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Patient Portal Login</Link></li>
              <li><Link to="/login?role=DOCTOR" style={{ color: '#cbd5e1' }}>Doctor Login</Link></li>
              <li><Link to="/login?role=ADMIN" style={{ color: '#cbd5e1' }}>Hospital Admin</Link></li>
            </ul>
          </div>

          {/* Top Departments */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1rem' }}>Key Departments</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li>Cardiology & Cardiac Sciences</li>
              <li>Neurology & Neurosurgery</li>
              <li>Orthopedics & Joint Care</li>
              <li>General Medicine</li>
              <li>Pediatrics & Child Care</li>
              <li>Dermatology & Cosmetology</li>
            </ul>
          </div>

          {/* Emergency & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1rem' }}>Hospital Helpdesk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--primary-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>124 Healthcare Avenue, Medical District, City Center</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--primary-400)" style={{ flexShrink: 0 }} />
                <span>+1 (800) 456-7890 / 080-1234567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="var(--primary-400)" style={{ flexShrink: 0 }} />
                <span>op-desk@medicarehospital.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="var(--primary-400)" style={{ flexShrink: 0 }} />
                <span>OP Hours: 08:00 AM - 08:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} MediCare OP Hospital System. All rights reserved.
          </div>
          <div>
            Designed with High-Availability Patient Care Architecture.
          </div>
        </div>
      </div>
    </footer>
  );
};
