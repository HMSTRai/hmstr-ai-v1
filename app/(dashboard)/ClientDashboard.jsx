'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ClientDashboard({ clientId, startDate, endDate }) {
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
        {/* Display your metrics as before */}
      </div>
      <details>
        <summary className="cursor-pointer text-gray-600 mt-3">Raw Data (debug)</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(metrics, null, 2)}</pre>
      </details>
    </div>
  );
}
