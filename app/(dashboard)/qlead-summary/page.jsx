'use client'

import { useEffect, useState } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
      />
    </div>
  )
}

function StatCard({ label, value, sublabel, color = 'text-blue-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-4 flex flex-col items-start min-w-[120px] transition hover:shadow-lg hover:bg-orange-50">
      <span className="text-sm text-gray-600">{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
      <div className="w-full h-8 mt-2">
        <svg className={`w-full h-full ${color}`} viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline points="0,25 20,20 40,25 60,15 80,20 100,10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">{title}</h3>}
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
    <div className="mt-4 sm:mt-6 md:mt-12">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6">Call Engagement Metrics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {data.map(({ label, value, sublabel, color }, i) => (
          <StatCard key={i} label={label} value={value} sublabel={sublabel} color={color} />
        ))}
      </div>
    </div>
  )
}

function LeadsTable({ leads }) {
  return (
    <SectionCard title="Qualified Leads Table">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">First Contact Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Customer Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Customer Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Customer City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Customer State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Service Inquired</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Lead Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Close Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Human Engaged</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">First Source</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.first_contact_date || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.customer_phone_number || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.customer_name || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.customer_city || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.customer_state || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.service_inquired || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.lead_score_max || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.close_score_max || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.human_engaged ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{lead.first_source || '--'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                  No qualified leads found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
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
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [volumeGroupBy, setVolumeGroupBy] = useState('day')
  const [costPerLeadGroupBy, setCostPerLeadGroupBy] = useState('day')

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
      setLeads([])
      return
    }
    setLoading(true)
    Promise.all([
      fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}&volumeGroupBy=${volumeGroupBy}&costPerLeadGroupBy=${costPerLeadGroupBy}`)
        .then(res => res.json())
        .then(({ data, error }) => {
          if (error) throw new Error(error)
          setMetrics(data || null)
          console.log('Fetched Metrics:', data)
        }),
      fetch(`/api/qualified-leads?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
        .then(res => res.json())
        .then(({ data, error }) => {
          if (error) throw new Error(error)
          setLeads(data || [])
          console.log('Fetched Leads:', data)
        })
    ])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate, volumeGroupBy, costPerLeadGroupBy])

  const volumeChartData = metrics?.volume_chart?.length > 0 ? metrics.volume_chart : createEmptyChartData(startDate, endDate)
  const costPerLeadChartData = metrics?.cost_per_lead_chart?.length > 0 ? metrics.cost_per_lead_chart : createEmptyChartData(startDate, endDate)

  const formatCurrency = val =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--'

  const formatNumber = val => (typeof val === 'number' ? val.toLocaleString() : '--')

  const formatPercent = val => (typeof val === 'number' ? `${val.toFixed(2)}%` : '--%')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      {/* Qualified Leads */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 mt-2 sm:mt-4">Qualified Leads</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <StatCard
            key="source-qualified-leads"
            label="Qualified Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads)}
            color="text-orange-600"
          />
          <StatCard
            key="source-ppc-leads"
            label="PPC Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_ppc)}
            color="text-orange-600"
          />
          <StatCard
            key="source-lsa-leads"
            label="LSA Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_lsa)}
            color="text-orange-600"
          />
          <StatCard
            key="source-seo-leads"
            label="SEO Leads"
            value={formatNumber(metrics?.sourceMetrics?.qualified_leads_seo)}
            color="text-orange-600"
          />
          <StatCard
            key="source-total-spend"
            label="Total Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_total)}
            color="text-orange-600"
          />
          <StatCard
            key="source-ppc-spend"
            label="Total PPC Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_ppc)}
            color="text-orange-600"
          />
          <StatCard
            key="source-lsa-spend"
            label="LSA Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_lsa)}
            color="text-orange-600"
          />
          <StatCard
            key="source-seo-spend"
            label="SEO Spend"
            value={formatCurrency(metrics?.sourceMetrics?.spend_seo)}
            color="text-orange-600"
          />
          <StatCard
            key="source-cpql-total"
            label="CPQL Total"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_total)}
            color="text-orange-600"
          />
          <StatCard
            key="source-cpql-ppc"
            label="CPQL PPC"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_ppc)}
            color="text-orange-600"
          />
          <StatCard
            key="source-cpql-lsa"
            label="CPQL LSA"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_lsa)}
            color="text-orange-600"
          />
          <StatCard
            key="source-cpql-seo"
            label="CPQL SEO"
            value={formatCurrency(metrics?.sourceMetrics?.cpql_seo)}
            color="text-orange-600"
          />
        </div>

        <CallEngagementMetrics metrics={metrics?.engagementMetrics} />
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-10 mt-4 sm:mt-6 md:mt-10 w-full">
        <SectionCard title="Qualified Leads Volume by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={volumeGroupBy}
              onChange={e => setVolumeGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={volumeChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
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
                <XAxis dataKey="date" tick={{ fontSize: 13}} interval="preserveStartEnd" />
                <YAxis label={{ angle: -90, position: 'insideLeft' }} allowDecimals={false} tick={{ fontSize: 13 }} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15 }}
                  labelStyle={{ fontWeight: 600, color: '#374151' }}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
                <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
                <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
                <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Cost Per Lead by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={costPerLeadGroupBy}
              onChange={e => setCostPerLeadGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={costPerLeadChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
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
                <XAxis dataKey="date" tick={{ fontSize: 13 }} interval="preserveStartEnd" />
                <YAxis label={{ angle: -90, position: 'insideLeft' }} tick={{ fontSize: 13 }} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15 }}
                  labelStyle={{ fontWeight: 600, color: '#374151' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
                <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
                <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
                <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center z-50">
          Loading...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full flex justify-center p-2 sm:p-3 md:p-4">
          <div className="bg-red-100 text-red-600 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2 rounded">{error}</div>
        </div>
      )}
    </div>
  )
}