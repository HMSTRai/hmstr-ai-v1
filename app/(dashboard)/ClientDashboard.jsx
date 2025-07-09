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
  ResponsiveContainer
} from 'recharts';

export default function ClientDashboard({ startDate, endDate, client }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('dashboard_insights', {
        start_date: startDate,
        end_date: endDate,
        client: client,
      });

      console.log('RPC DATA:', data);
      console.log('RPC ERROR:', error);

      if (error) {
        console.error('Failed to load metrics:', error);
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

  if (loading) return <p>Loading...</p>;
  if (!metrics || metrics.length === 0) return <p>No Data</p>;

  // Optional formatting utility
  const formatCurrency = (value) =>
    `$${(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">📊 Metrics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-500">Total Leads</p>
          <p className="text-xl font-semibold">{metrics[0]?.leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">PPC Leads</p>
          <p className="text-xl">{metrics[0]?.ppc_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">LSA Leads</p>
          <p className="text-xl">{metrics[0]?.lsa_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">SEO Leads</p>
          <p className="text-xl">{metrics[0]?.seo_leads ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Spend</p>
          <p className="text-xl">{formatCurrency(metrics[0]?.spend ?? 0)}</p>
        </div>
        <div>
          <p className="text-gray-500">Cost Per Lead</p>
          <p className="text-xl">{formatCurrency(metrics[0]?.cost_per_lead ?? 0)}</p>
        </div>
      </div>

      {/* Example of chart (optional) */}
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
    </div>
  );
}
