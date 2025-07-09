'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function ClientSelector({ onSelect }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase
        .from('clients_ffs')
        .select('cr_client_id, cr_company_name');
      setClients(data || []);
      setLoading(false);
    }
    fetchClients();
  }, []);

  if (loading) return <p>Loading clients...</p>;

  return (
    <div>
      <label className="block mb-1 font-semibold">Select Client:</label>
      <select
        className="border rounded px-3 py-2 min-w-[220px]"
        onChange={e => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="">-- Choose a client --</option>
        {clients.map(client => (
          <option key={client.cr_client_id} value={client.cr_client_id}>
            {client.cr_company_name}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateSelector({ startDate, endDate, onChange }) {
  return (
    <div className="flex gap-4 items-end">
      <div>
        <label className="block mb-1 font-semibold">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => onChange('startDate', e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={e => onChange('endDate', e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}

function MetricsDashboard({ clientId, startDate, endDate }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    supabase
      .rpc('get_top_metrics', {
        input_client_id: clientId,
        input_start_date: startDate,
        input_end_date: endDate,
      })
      .then(({ data, error }) => {
        if (error) setError(error.message || 'Unknown error');
        else setMetrics(data && data.length ? data[0] : null);
        setLoading(false);
      });
  }, [clientId, startDate, endDate]);

  if (!clientId) return <p>Please select a client above.</p>;
  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!metrics) return <p>No data found for this client and date range.</p>;

  return (
    <div className="space-y-3 mt-4">
      <h2 className="text-xl font-bold mb-4">📈 Metrics for Selected Client</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-500">Qualified Leads</p>
          <p className="text-xl font-semibold">{metrics.qualified_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">PPC Leads</p>
          <p className="text-xl">{metrics.qualified_leads_ppc ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">LSA Leads</p>
          <p className="text-xl">{metrics.qualified_leads_lsa ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">SEO Leads</p>
          <p className="text-xl">{metrics.qualified_leads_seo ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Spend</p>
          <p className="text-xl">${metrics.spend_total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-gray-500">CPQL Total</p>
          <p className="text-xl">${metrics.cpql_total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      <details>
        <summary className="cursor-pointer text-gray-600 mt-3">Raw Data (debug)</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(metrics, null, 2)}</pre>
      </details>
    </div>
  );
}

// --- Main Page ---
export default function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(today);

  const handleDateChange = (type, value) => {
    if (type === 'startDate') setStartDate(value);
    else setEndDate(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar is assumed rendered by your layout, so just margin for content */}
      <main className="pl-8 pt-10 w-full">
        <div className="flex items-center gap-8 mb-6">
          <ClientSelector onSelect={setSelectedClient} />
          <DateSelector startDate={startDate} endDate={endDate} onChange={handleDateChange} />
        </div>
        <MetricsDashboard clientId={selectedClient} startDate={startDate} endDate={endDate} />
      </main>
    </div>
  );
}
