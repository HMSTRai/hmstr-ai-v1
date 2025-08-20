'use client';

import React from 'react';

const DashboardSectionLayout = ({ title, subtitle, children }) => {
  return (
    <section className="rounded-sm shadow-sm border border-[#f36622] -m-6 -mb-9 pt-0 pb-0">  {/* Use negative margin here if needed */}
      <div className="p-4 pt-0 pb-0">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-0 pt-0">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
};

export default DashboardSectionLayout;