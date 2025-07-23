'use client';

import React from 'react';

const DashboardSectionLayout = ({ title, subtitle, children }) => {
  return (
    <section className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
      <div className="mb-4">
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
