'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ClientDashboard({ startDate, endDate, client }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Call the Supabase RPC
      const { data, error } = await supabase.rpc('dashboard_insights', {
        company_id: client,     // Make sure this matches your RPC parameter name
        start_date: startDate,
        end_date: endDate,
      });

      console.log('RPC DATA:', data);
      console.log('RPC ERROR:', error);

      if (error) {
        setError(error.message || 'Unknown error');
        setMetrics(null);
      } else {
        setMetrics(data);
      }

      setLoading(false);
    };

    if (startDate && endDate && client) {
      fetchData();
    }
  }, [startDate, endDate, client]);

  // Debug output for development/troubleshooting
  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    );
  if (!metrics || metrics.length === 0)
    return (
      <div>
        <p>No Data</p>
        <h3>Debug Output:</h3>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    );

  // Formatting helper
  const formatCurrency = (value) =>
    `$${(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Metrics overview (use the first row for summary numbers)
  const summary = metrics[0] || {};

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">📊 Metrics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-500">Total Leads</p>
          <p className="text-xl font-semibold">{summary.leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">PPC Leads</p>
          <p className="text-xl">{summary.ppc_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">LSA Leads</p>
          <p className="text-xl">{summary.lsa_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">SEO Leads</p>
          <p className="text-xl">{summary.seo_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Spend</p>
          <p className="text-xl">{formatCurrency(summary.spend ?? 0)}</p>
        </div>
        <div>
          <p className="text-gray-500">Cost Per Lead</p>
          <p className="text-xl">{formatCurrency(summary.cost_per_lead ?? 0)}</p>
        </div>
      </div>

      <h3 className="font-semibold text-lg mt-8">Leads Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={metrics}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="leads" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Debug output for development (remove/comment out in prod) */}
      <details>
        <summary className="cursor-pointer font-mono text-gray-400 mt-4">
          Raw Data (debug)
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(metrics, null, 2)}</pre>
      </details>
    </div>
  );
}
