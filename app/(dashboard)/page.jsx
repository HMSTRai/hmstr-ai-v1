'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="border rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      <option value="">Select Client</option>
      {clients.map(c => (
        <option key={c.client_id ?? c.cr_client_id} value={c.client_id ?? c.cr_client_id}>
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

// Helper to create zeroed data for the charts
function createEmptyChartData(start, end) {
  if (!start || !end || start > end) return []
  const result = []
  let current = new Date(start)
  const endDateObj = new Date(end)
  while (current <= endDateObj) {
    const dateStr = current.toISOString().slice(0, 10)
    result.push({
      date: dateStr,
      total: 0,
      ppc: 0,
      lsa: 0,
      seo: 0,
    })
    current.setDate(current.getDate() + 1)
  }
  return result
}

export default function ModernDashboard() {
  const today = new Date().toISOString().slice(0, 10)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch clients
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setClients(data || [])
      })
      .catch(err => setError(err.message))
  }, [])

  // Fetch metrics only if client selected and date range valid
  useEffect(() => {
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setMetrics(null)
      return
    }
    setLoading(true)
    fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setMetrics(data ? data : null)
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  // Use zeroed data if no metrics or empty data
  const leadsChartData =
    metrics && metrics.leads_chart && metrics.leads_chart.length > 0
      ? metrics.leads_chart
      : createEmptyChartData(startDate, endDate)

  const cpqlChartData =
    metrics && metrics.cpql_chart && metrics.cpql_chart.length > 0
      ? metrics.cpql_chart
      : createEmptyChartData(startDate, endDate)

  const formatCurrency = (val) =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--'

  const formatPercent = (val) =>
    typeof val === 'number' ? `${val.toFixed(2)}%` : '--%'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-0">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-10 pt-10">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
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
            <StatCard label="Total Spend" value={formatCurrency(metrics?.spend_total)} color="text-purple-700" />
            <StatCard label="CPQL Total" value={formatCurrency(metrics?.cpql_total)} color="text-teal-600" />
          </div>
        </SectionCard>
      </div>

      {/* Engagement Metrics */}
      <div className="flex gap-6 px-10">
        <SectionCard>
          <div className="flex flex-row gap-12 items-center">
            <div>
              <div className="text-gray-500 mb-1">Human Engagement Rate</div>
              <div className="text-2xl font-bold text-blue-700">{formatPercent(metrics?.human_engagement_rate)}</div>
              <div className="text-xs text-gray-400">{metrics?.human_engaged_count ?? '--'} of {metrics?.human_total_count ?? '--'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">AI Forward Rate</div>
              <div className="text-2xl font-bold text-green-700">{formatPercent(metrics?.ai_forward_rate)}</div>
              <div className="text-xs text-gray-400">{metrics?.ai_forward_count ?? '--'} of {metrics?.ai_total_count ?? '--'}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Modern Stacked AreaCharts */}
      <div className="flex flex-col gap-6 px-10 pb-10 mt-4">
        <SectionCard title="Qualified Leads by Period">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={leadsChartData} margin={{ top: 20, right: 32, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="8 8" stroke="#ececec" />
              <XAxis dataKey="date" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip contentStyle={{ borderRadius: 14, fontSize: 15 }} labelStyle={{ fontWeight: 600, color: '#374151' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="total" name="Total" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.23} />
              <Area type="monotone" dataKey="ppc" name="PPC" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.18} />
              <Area type="monotone" dataKey="lsa" name="LSA" stackId="1" stroke="#f59e42" fill="#f59e42" fillOpacity={0.18} />
              <Area type="monotone" dataKey="seo" name="SEO" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Cost Per Qualified Lead by Period">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={cpqlChartData} margin={{ top: 20, right: 32, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="8 8" stroke="#ececec" />
              <XAxis dataKey="date" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip contentStyle={{ borderRadius: 14, fontSize: 15 }} labelStyle={{ fontWeight: 600, color: '#374151' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="total" name="Total" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.23} />
              <Area type="monotone" dataKey="ppc" name="PPC" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.18} />
              <Area type="monotone" dataKey="lsa" name="LSA" stackId="1" stroke="#f59e42" fill="#f59e42" fillOpacity={0.18} />
              <Area type="monotone" dataKey="seo" name="SEO" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center z-50">
          Loading...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full flex justify-center p-4">
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</div>
        </div>
      )}
    </div>
  )
}
