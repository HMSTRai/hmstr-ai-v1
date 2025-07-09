'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ClientDashboard from './ClientDashboard';

function ClientSelector({ onSelect }) {
  // ...same as before
}

export default function DashboardPage() {
  const [selectedClient, setSelectedClient] = useState('');
  const startDate = '2025-01-01';
  const endDate = '2025-08-01';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ClientSelector onSelect={setSelectedClient} />
      <ClientDashboard clientId={selectedClient} startDate={startDate} endDate={endDate} />
    </div>
  );
}
