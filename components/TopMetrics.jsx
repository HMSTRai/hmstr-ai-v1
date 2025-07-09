'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function TopMetrics({ clientId, startDate, endDate }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('dashboard_insights', {
        client_id: clientId,
        start_date: startDate,
        end_date: endDate,
      });

      console.log('RPC data:', data);
      console.log('RPC error:', error);

      if (error) {
        setError('Failed to load metrics');
        setMetrics(null);
      } else {
        setMetrics(data);
      }

      setLoading(false);
    };

    if (clientId && startDate && endDate) {
      fetchMetrics();
    }
  }, [clientId, startDate, endDate]);

  const formatCurrency = (value) =>
    `$${value ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`;

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!metrics) return <div className="p-4">No data available</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Top Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div><strong>PPC Leads:</strong> {metrics.ppc_leads ?? 0}</div>
        <div><strong>LSA Leads:</strong> {metrics.lsa_leads ?? 0}</div>
        <div><strong>SEO Leads:</strong> {metrics.seo_leads ?? 0}</div>
        <div><strong>Total Spend:</strong> {formatCurrency(metrics.total_spend)}</div>
        <div><strong>PPC Spend:</strong> {formatCurrency(metrics.ppc_spend)}</div>
        <div><strong>LSA Spend:</strong> {formatCurrency(metrics.lsa_spend)}</div>
        <div><strong>SEO Spend:</strong> {formatCurrency(metrics.seo_spend)}</div>
        <div><strong>CPQL PPC:</strong> {formatCurrency(metrics.cpql_ppc)}</div>
        <div><strong>CPQL LSA:</strong> {formatCurrency(metrics.cpql_lsa)}</div>
        <div><strong>CPQL SEO:</strong> {formatCurrency(metrics.cpql_seo)}</div>
        <div><strong>CPQL Total:</strong> {formatCurrency(metrics.cpql_total)}</div>
      </div>
    </div>
  );
}
