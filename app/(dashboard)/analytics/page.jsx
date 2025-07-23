'use client'

import { useEffect, useState } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts'

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
    <div className="flex items-center gap-2 flex-wrap">
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
      <span className="text-sm text-gray-500 text-center">{label}</span>
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

function CallEngagementMetrics({ metrics }) {
  const formatPercent = (val) => (typeof val === 'number' ? `${val.toFixed(2)}%` : '--%')
  const formatCount = (num, total) =>
    typeof num === 'number' && typeof total === 'number' ? `${num} of ${total}` : '0 of 0'

  const data = [
    {
      label: 'Human Engagement Rate',
      value: formatPercent(metrics?.human_engagement_rate),
      color: 'text-blue-700',
    },
    {
      label: 'AI Forward Rate',
      value: formatPercent(metrics?.ai_forward_rate),
      color: 'text-green-700',
    },
    {
      label: 'Human Engaged',
      value: formatCount(metrics?.human_engaged_count, metrics?.human_total_count),
      color: 'text-blue-700',
    },
    {
      label: 'AI Forwarded',
      value: formatCount(metrics?.ai_forward_count, metrics?.ai_total_count),
      color: 'text-green-700',
    },
  ]

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Call Engagement Metrics</h2>
      <div className="flex flex-wrap justify-start gap-6">
        {data.map(({ label, value, sublabel, color }, i) => (
          <StatCard key={i} label={label} value={value} sublabel={sublabel} color={color} />
        ))}
      </div>
    </div>
  )
}

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
  const [volumeGroupBy, setVolumeGroupBy] = useState('day')
  const [costPerLeadGroupBy, setCostPerLeadGroupBy] = useState('day')
  const [costGroupBy, setCostGroupBy] = useState('day')
  const [cpqlGroupBy, setCpqlGroupBy] = useState('day')

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
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setMetrics(null)
      return
    }
    setLoading(true)
    fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}&groupBy=${volumeGroupBy}`)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setMetrics(data || null)
        console.log('Fetched Metrics:', data);
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate, volumeGroupBy, costPerLeadGroupBy, costGroupBy, cpqlGroupBy])

  // Use chart data from backend or empty fallback
  const volumeChartData = metrics?.volume_chart?.length > 0 ? metrics.volume_chart : createEmptyChartData(startDate, endDate);
  const costPerLeadChartData = metrics?.cost_per_lead_chart?.length > 0 ? metrics.cost_per_lead_chart : createEmptyChartData(startDate, endDate);

  const formatCurrency = val =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--'

  const formatNumber = val => (typeof val === 'number' ? val.toLocaleString() : '--')

  const formatPercent = val => (typeof val === 'number' ? `${val.toFixed(2)}%` : '--%')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-0">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-10 pt-10">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      {/* Qualified Leads */}
      <div className="px-4 md:px-10 mt-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 mt-4">Qualified Leads</h2>
        {/* First row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-6">
          <StatCard
            key="source-qualified-leads"
            label="Qualified Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads)}
            color="text-blue-700"
          />
          <StatCard
            key="source-ppc-leads"
            label="PPC Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_ppc)}
            color="text-green-600"
          />
          <StatCard
            key="source-lsa-leads"
            label="LSA Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_lsa)}
            color="text-yellow-600"
          />
          <StatCard
            key="source-seo-leads"
            label="SEO Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_seo)}
            color="text-pink-600"
          />
          <StatCard
            key="source-total-spend"
            label="Total Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_total)}
            color="text-purple-700"
          />
          <StatCard
            key="source-ppc-spend"
            label="Total PPC Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_ppc)}
            color="text-purple-700"
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          <StatCard
            key="source-lsa-spend"
            label="LSA Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_lsa)}
            color="text-yellow-600"
          />
          <StatCard
            key="source-seo-spend"
            label="SEO Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_seo)}
            color="text-pink-600"
          />
          <StatCard
            key="source-cpql-total"
            label="CPQL Total"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_total)}
            color="text-teal-600"
          />
          <StatCard
            key="source-cpql-ppc"
            label="CPQL PPC"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_ppc)}
            color="text-teal-600"
          />
          <StatCard
            key="source-cpql-lsa"
            label="CPQL LSA"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_lsa)}
            color="text-teal-600"
          />
          <StatCard
            key="source-cpql-seo"
            label="CPQL SEO"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_seo)}
            color="text-teal-600"
          />
        </div>

        {/* Call Engagement Metrics */}
        <CallEngagementMetrics metrics={metrics?.engagementMetrics} />
        
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-6 px-4 md:px-10 pb-10 mt-10 max-w-7xl mx-auto w-full">
        
        {/* Qualified Leads Volume by Period */}
        <SectionCard title="Qualified Leads Volume by Period">
          <div className="flex justify-end mb-4">
            <select
              className="border rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none"
              value={volumeGroupBy}
              onChange={e => setVolumeGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={volumeChartData}
              margin={{ top: 10, right: 32, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPpc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLsa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 14 }} />
              <YAxis label={{ angle: -90, position: 'insideLeft' }} allowDecimals={false} tick={{ fontSize: 14 }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: 14, fontSize: 15 }}
                labelStyle={{ fontWeight: 600, color: '#374151' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
              <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
              <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
              <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Cost Per Lead by Period */}
        <SectionCard title="Cost Per Lead by Period">
          <div className="flex justify-end mb-4">
            <select
              className="border rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none"
              value={costPerLeadGroupBy}
              onChange={e => setCostPerLeadGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={costPerLeadChartData}
              margin={{ top: 10, right: 32, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPpc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLsa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 14 }} />
              <YAxis label={{ angle: -90, position: 'insideLeft' }} tick={{ fontSize: 14 }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: 14, fontSize: 15 }}
                labelStyle={{ fontWeight: 600, color: '#374151' }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
              <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
              <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
              <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
            </ComposedChart>
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