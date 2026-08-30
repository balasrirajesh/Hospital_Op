import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Bone, 
  Activity, 
  Baby, 
  Sparkles, 
  Ear, 
  Eye, 
  Smile, 
  Stethoscope, 
  UserCheck, 
  Wind, 
  Droplet, 
  UtensilsCrossed, 
  ArrowRight 
} from 'lucide-react';

const iconMap = {
  'Cardiology': Heart,
  'Neurology': Brain,
  'Orthopedics': Bone,
  'General Medicine': Activity,
  'Pediatrics': Baby,
  'Dermatology': Sparkles,
  'ENT': Ear,
  'Ophthalmology': Eye,
  'Dental': Smile,
  'Gynecology': UserCheck,
  'Pulmonology': Wind,
  'Urology': Droplet,
  'Gastroenterology': UtensilsCrossed,
};

export const DepartmentCard = ({ department, doctorCount }) => {
  const IconComponent = iconMap[department.name] || Stethoscope;

  return (
    <div className="card card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--primary-100)'
        }}>
          <IconComponent size={26} />
        </div>
        {doctorCount !== undefined && (
          <span className="badge badge-primary">
            {doctorCount} {doctorCount === 1 ? 'Doctor' : 'Doctors'}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>
        {department.name}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
        {department.description || 'Specialized clinical care, diagnostic assessments, and dedicated OP treatments.'}
      </p>

      <Link
        to={`/doctors?departmentId=${department.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: 'var(--primary-700)',
          marginTop: 'auto'
        }}
      >
        <span>View Available Doctors</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};
