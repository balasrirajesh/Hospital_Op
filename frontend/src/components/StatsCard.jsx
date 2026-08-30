import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'var(--primary-600)', bgColor = 'var(--primary-50)' }) => {
  return (
    <div className="stat-card">
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.775rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div 
        className="stat-icon-wrapper" 
        style={{ backgroundColor: bgColor, color: color }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};
