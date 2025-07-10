'use client'

import { useEffect, useState } from 'react'

export default function ModernDashboard() {
  // For test, use the known clientId/date range from your screenshot:
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('48')
  const [startDate, setStartDate] = useState('2024-03-03')
  const [endDate, setEndDate] = useState('2025-04-04')
  const [metrics, setMetrics] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setClients(data || [])
      })
      .catch(err => setError(err.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        if (Array.isArray(data) && data.length > 0) {
          setMetrics(data[0])
          console.log('METRICS LOADED:', data[0])
        } else {
          setMetrics(null)
          console.log('No metrics found')
        }
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-xl font-bold mb-4">Metrics Test</h1>
      <div>
        <pre className="text-xs bg-gray-100 p-4 rounded">{metrics ? JSON.stringify(metrics, null, 2) : 'No metrics'}</pre>
      </div>
      {metrics && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div>Qualified Leads</div>
            <div className="font-bold">{metrics.qualified_leads}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>PPC Leads</div>
            <div className="font-bold">{metrics.qualified_leads_ppc}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>LSA Leads</div>
            <div className="font-bold">{metrics.qualified_leads_lsa}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>SEO Leads</div>
            <div className="font-bold">{metrics.qualified_leads_seo}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>Total Spend</div>
            <div className="font-bold">${metrics.spend_total?.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>CPQL Total</div>
            <div className="font-bold">${metrics.cpql_total?.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
        </div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
