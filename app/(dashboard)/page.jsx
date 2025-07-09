'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="border rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      <option value="">Select Client</option>
      {clients.map(c => (
        <option key={c.cr_client_id} value={c.cr_client_id}>
          {c.cr_company_name}
        </option>
      ))}
    </select>
  );
}

function DateSelector({ startDate, endDate, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="border rounded-lg px-2 py-2"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400">to</span>
      <input
        type="date"
        className="border rounded-lg px-2 py-2"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
      />
    </div>
  );
}

function StatCard({ label, value, sublabel, color = 'text-blue-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex flex-col items-center min-w-[120px]">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
      {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
    </div>
  );
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      {children}
    </section>
  );
}

export default function ModernDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState(today);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch clients
  useEffect(() => {
    supabase
      .from('clients_ffs')
      .select('cr_client_id, cr_company_name')
      .then(({ data }) => setClients(data || []));
  }, []);

  // Fetch metrics for selected client & date
  useEffect(() => {
    if (!selectedClient) return setMetrics(null);
    setLoading(true);
    supabase
      .rpc('get_top_metrics', {
        input_client_id: selectedClient,
        input_start_date: startDate,
        input_end_date: endDate,
      })
      .then(({ data }) => {
        setMetrics(data && data.length ? data[0] : null);
        setLoading(false);
      });
  }, [selectedClient, startDate, endDate]);

  // Mock chart data for demo (replace with your actual data)
  const leadsChartData = [
    { date: '2025-05-01', total: 5, ppc: 1, lsa: 2, seo: 2 },
    { date: '2025-05-02', total: 15, ppc: 10, lsa: 3, seo: 2 },
    // ... fill with real values
  ];

  const cpqlChartData = [
    { date: '2025-05-01', total: 80, ppc: 224, lsa: 0, seo: 0 },
    { date: '2025-06-01', total: 120, ppc: 180, lsa: 0, seo: 0 },
    // ... fill with real values
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-0">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-10 pt-10">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => type === 'startDate' ? setStartDate(val) : setEndDate(val)}
        />
      </div>
      {/* Main Metrics */}
      <div className="flex flex-col md:flex-row gap-6 px-10 mt-6">
        <SectionCard>
          <div className="flex flex-wrap gap-6 justify-between items-center">
            <StatCard label="Qualified Leads" value={metrics?.qualified_leads ?? '--'} color="text-blue-700" />
            <StatCard label="PPC Leads" value={metrics?.qualified_leads_ppc ?? '--'} color="text-green-600" />
            <StatCard label="LSA Leads" value={metrics?.qualified_leads_lsa ?? '--'} color="text-yellow-600" />
            <StatCard label="SEO Leads" value={metrics?.qualified_leads_seo ?? '--'} color="text-pink-600" />
            <StatCard label="Total Spend" value={`$${metrics?.spend_total?.toLocaleString(undefined, {minimumFractionDigits:2}) ?? '--'}`} color="text-purple-700" />
            <StatCard label="CPQL Total" value={`$${metrics?.cpql_total?.toLocaleString(undefined, {minimumFractionDigits:2}) ?? '--'}`} color="text-teal-600" />
          </div>
        </SectionCard>
      </div>

      {/* Engagement Metrics Example */}
      <div className="flex gap-6 px-10">
        <SectionCard>
          <div className="flex flex-row gap-12 items-center">
            <div>
              <div className="text-gray-500 mb-1">Human Engagement Rate</div>
              <div className="text-2xl font-bold text-blue-700">32.41%</div>
              <div className="text-xs text-gray-400">140 of 432</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">AI Forward Rate</div>
              <div className="text-2xl font-bold text-green-700">73.15%</div>
              <div className="text-xs text-gray-400">316 of 432</div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-6 px-10 pb-10 mt-4">
        <SectionCard title="Qualified Leads by Period">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={leadsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" />
              <Line type="monotone" dataKey="ppc" stroke="#10b981" name="PPC" />
              <Line type="monotone" dataKey="lsa" stroke="#f59e42" name="LSA" />
              <Line type="monotone" dataKey="seo" stroke="#ec4899" name="SEO" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
        
        <SectionCard title="Cost Per Qualified Lead by Period">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={cpqlChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" />
              <Line type="monotone" dataKey="ppc" stroke="#10b981" name="PPC" />
              <Line type="monotone" dataKey="lsa" stroke="#f59e42" name="LSA" />
              <Line type="monotone" dataKey="seo" stroke="#ec4899" name="SEO" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
