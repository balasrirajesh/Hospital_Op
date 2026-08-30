import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { DepartmentCard } from '../components/DepartmentCard';
import { Building2, Search, Activity } from 'lucide-react';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    departmentService.getAllDepartments()
      .then((data) => setDepartments(data))
      .catch((err) => console.error('Error fetching departments:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Building2 size={16} />
          <span>Clinical Excellence</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>Hospital Medical Departments</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Explore our medical specialties, diagnostic divisions, and out-patient consulting centers.
        </p>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search department by name or specialty..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--primary-100)',
            borderTopColor: 'var(--primary-600)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading departments...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredDepts.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} doctorCount={dept.doctorCount || 3} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
