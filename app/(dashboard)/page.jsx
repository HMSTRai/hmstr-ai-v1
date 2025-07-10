'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// --- Simple utility components ---

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
  )
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
  )
}

function StatCard({ label, value, sublabel, color = 'text-blue-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex flex-col items-center min-w-[120px] transition hover:shadow-lg hover:bg-gray-50">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
      {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
    </div>
  )
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      {children}
    </section>
  )
}

// --- Main Dashboard Component ---

export default function ModernDashboard() {
  const today = new Date().toISOString().slice(0, 10)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('2025-05-01')
  const [endDate, setEndDate] = useState(today)
  const [metrics, setMetrics] = useState(undefined) // undefined=not loaded, null=no data, object=data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- Fetch clients ---
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setClients(data || [])
      })
      .catch(err => setError(err.message))
  }, [])

  // --- Fetch metrics ---
  useEffect(() => {
    if (!selectedClient) {
      setMetrics(undefined)
      return
    }
    setLoading(true)
    fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        if (Array.isArray(data) && data.length > 0) {
          setMetrics(data[0])
          console.log("Loaded metrics:", data[0])
        } else {
          setMetrics(null) // No data for this selection
          console.log("No metrics for this selection")
        }
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  // --- Chart data ---
  const leadsChartData = metrics?.leads_chart || []
  const cpqlChartData = metrics?.cpql_chart || []

  // --- Money formatting ---
  const formatMoney = val =>
    typeof val === "number"
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--'

  // --- Determine if ALL metrics are zero (for empty-state message) ---
  function allZeroMetrics(obj) {
    if (!obj) return false
    const keys = [
      'qualified_leads','qualified_leads_ppc','qualified_leads_lsa','qualified_leads_seo',
      'spend_ppc','spend_lsa','spend_seo','spend_total',
      'cpql_ppc','cpql_lsa','cpql_seo','cpql_total'
    ]
    return keys.every(k => Number(obj[k]) === 0)
  }

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

      {/* Loading/Error */}
      {loading && (
        <div className="w-full flex justify-center items-center py-10">
          <span className="text-gray-400">Loading...</span>
        </div>
      )}
      {error && (
        <div className="w-full flex justify-center items-center py-10">
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</div>
        </div>
      )}

      {/* Print metrics object for debug (remove in prod) */}
      {metrics && (
        <div className="px-10 mt-2">
          <pre className="bg-gray-100 p-2 text-xs rounded">{JSON.stringify(metrics, null, 2)}</pre>
        </div>
      )}

      {/* No Data State */}
      {metrics === null && !loading && !error && (
        <div className="w-full flex justify-center items-center py-10">
          <span className="text-gray-400">No data available for this client and date range.</span>
        </div>
      )}

      {/* All metrics zero (show no data message) */}
      {metrics && allZeroMetrics(metrics) && !loading && !error && (
        <div className="w-full flex justify-center items-center py-10">
          <span className="text-gray-400">No results for this client and date range.</span>
        </div>
      )}

      {/* Main Metrics (show only if not all zero) */}
      {metrics && !allZeroMetrics(metrics) && (
        <>
          <div className="flex flex-col md:flex-row gap-6 px-10 mt-6">
            <SectionCard>
              <div className="flex flex-wrap gap-6 justify-between items-center">
                <StatCard label="Qualified Leads" value={metrics?.qualified_leads ?? '--'} color="text-blue-700" />
                <StatCard label="PPC Leads" value={metrics?.qualified_leads_ppc ?? '--'} color="text-green-600" />
                <StatCard label="LSA Leads" value={metrics?.qualified_leads_lsa ?? '--'} color="text-yellow-600" />
                <StatCard label="SEO Leads" value={metrics?.qualified_leads_seo ?? '--'} color="text-pink-600" />
                <StatCard label="Total Spend" value={formatMoney(metrics?.spend_total)} color="text-purple-700" />
                <StatCard label="CPQL Total" value={formatMoney(metrics?.cpql_total)} color="text-teal-600" />
              </div>
            </SectionCard>
          </div>

          {/* Engagement Metrics */}
          <div className="flex gap-6 px-10">
            <SectionCard>
              <div className="flex flex-row gap-12 items-center">
                <div>
                  <div className="text-gray-500 mb-1">Human Engagement Rate</div>
                  <div className="text-2xl font-bold text-blue-700">{metrics?.human_engagement_rate ?? '--'}%</div>
                  <div className="text-xs text-gray-400">{metrics?.human_engaged_count ?? '--'} of {metrics?.human_total_count ?? '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">AI Forward Rate</div>
                  <div className="text-2xl font-bold text-green-700">{metrics?.ai_forward_rate ?? '--'}%</div>
                  <div className="text-xs text-gray-400">{metrics?.ai_forward_count ?? '--'} of {metrics?.ai_total_count ?? '--'}</div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Charts */}
          <div className="flex flex-col gap-6 px-10 pb-10 mt-4">
            <SectionCard title="Qualified Leads by Period">
              {leadsChartData.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No chart data available.
                </div>
              ) : (
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
              )}
            </SectionCard>
            
            <SectionCard title="Cost Per Qualified Lead by Period">
              {cpqlChartData.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No chart data available.
                </div>
              ) : (
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
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}
