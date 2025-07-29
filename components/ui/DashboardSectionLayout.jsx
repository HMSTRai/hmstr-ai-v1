'use client';

import React from 'react';

const DashboardSectionLayout = ({ title, subtitle, children }) => {
  return (
    <section className="bg-gray-50 rounded-l shadow-sm border border-gray-100">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
};


export default DashboardSectionLayout;
