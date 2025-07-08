'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function TopMetrics({ clientId, startDate, endDate }) {

  const [metrics, setMetrics] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('dashboard_insights', {
        start_date: startDate,
        end_date: endDate,
        client: clientId,
      });

      if (error || !data) {
        setError('Error loading metrics');
        setMetrics(null);
        setPieData([]);
      } else {
        setMetrics(data);
        setPieData([
          { name: 'PPC', value: data.ppc_leads || 0 },
          { name: 'LSA', value: data.lsa_leads || 0 },
          { name: 'SEO', value: data.seo_leads || 0 },
        ]);
      }

      setLoading(false);
    };

    if (clientId && startDate && endDate) {
      fetchMetrics();
    }
  }, [clientId, startDate, endDate]);

  if (loading) return <p>Loading...</p>;
  if (error || !metrics) return <p>No data</p>;

  const formatCurrency = (value) =>
    `$${(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Top Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><strong>All QLeads:</strong> {metrics.leads ?? 0}</div>
        <div><strong>PPC QLeads:</strong> {metrics.ppc_leads ?? 0}</div>
        <div><strong>LSA QLeads:</strong> {metrics.lsa_leads ?? 0}</div>
        <div><strong>SEO QLeads:</strong> {metrics.seo_leads ?? 0}</div>
        <div><strong>Cost/QL (All):</strong> {formatCurrency(metrics.cost_per_ql_all ?? 0)}</div>
        <div><strong>Cost/QL (PPC):</strong> {formatCurrency(metrics.cost_per_ql_ppc ?? 0)}</div>
        <div><strong>Cost/QL (LSA):</strong> {formatCurrency(metrics.cost_per_ql_lsa ?? 0)}</div>
        <div><strong>Cost/QL (SEO):</strong> {formatCurrency(metrics.cost_per_ql_seo ?? 0)}</div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-2">Qualified Leads by Source</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
