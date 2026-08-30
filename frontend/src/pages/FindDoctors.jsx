import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { departmentService } from '../services/departmentService';
import { DoctorCard } from '../components/DoctorCard';
import { Search, Filter, Stethoscope, RefreshCw, AlertCircle } from 'lucide-react';

export const FindDoctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('departmentId') || '');
  const [selectedDay, setSelectedDay] = useState(searchParams.get('dayOfWeek') || '');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    departmentService.getAllDepartments()
      .then(setDepartments)
      .catch((err) => console.error('Error fetching departments:', err));
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedDept) params.departmentId = selectedDept;
        if (selectedDay) params.dayOfWeek = selectedDay;

        const data = await doctorService.getAllDoctors(params);
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchTerm, selectedDept, selectedDay]);

  const handleDeptSelect = (deptId) => {
    setSelectedDept(deptId === selectedDept ? '' : deptId);
    if (deptId === selectedDept) {
      searchParams.delete('departmentId');
    } else {
      searchParams.set('departmentId', deptId);
    }
    setSearchParams(searchParams);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedDay('');
    setStatusFilter('');
    setSearchParams({});
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (statusFilter === 'AVAILABLE' && doc.status !== 'ACTIVE') return false;
    return true;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Stethoscope size={16} />
          <span>Specialist Directory</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>Find Specialist Doctors</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Search by doctor name, specialization, medical department, and view real-time availability.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          {/* Search by Name / Specialization */}
          <div>
            <label className="form-label">Doctor Name or Keyword</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="e.g. Dr. Ravi, Cardiologist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="form-label">Medical Department</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                if (e.target.value) searchParams.set('departmentId', e.target.value);
                else searchParams.delete('departmentId');
                setSearchParams(searchParams);
              }}
              className="form-select"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Day of Week Filter */}
          <div>
            <label className="form-label">Consultation Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="form-select"
            >
              <option value="">Any Day</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <RefreshCw size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Department Filter Chips */}
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Filters:</span>
          {departments.slice(0, 6).map((dept) => {
            const isSelected = selectedDept == dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => handleDeptSelect(dept.id)}
                style={{
                  fontSize: '0.775rem',
                  fontWeight: '600',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--primary-700)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--primary-700)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {dept.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
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
          <p style={{ color: 'var(--text-muted)' }}>Loading doctor availability schedules...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <AlertCircle size={44} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No Doctors Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            We couldn't find any doctors matching your selected filters. Try changing your search query or resetting filters.
          </p>
          <button onClick={handleReset} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: '600' }}>
            Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
