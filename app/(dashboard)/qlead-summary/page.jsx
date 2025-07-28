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

function StatCard({ label, value, sublabel, color = 'text-blue-600', changeText, changeColor, iconType }) {
  const getIcon = (type) => {
    if (type === 'bar') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="4" y="10" width="4" height="10" />
          <rect x="10" y="4" width="4" height="16" />
          <rect x="16" y="8" width="4" height="12" />
        </svg>
      );
    }
    if (type === 'wallet') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7ZM4 10H20" />
          <circle cx="18" cy="12" r="1" />
        </svg>
      );
    }
    if (type === 'dollar') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-start min-w-[120px] transition hover:shadow-lg hover:bg-orange-50">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
        <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
        {changeText && <span className={`text-sm font-medium ${changeColor}`}>{changeText}</span>}
      </div>
      {iconType && (
        <div className="ml-4">
          <div className="w-10 h-10 rounded-full border border-orange-300 flex items-center justify-center">
            {getIcon(iconType)}
          </div>
        </div>
      )}
    </div>
  );
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
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
  const [previousMetrics, setPreviousMetrics] = useState(null)
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
      setPreviousMetrics(null)
      setLeads([])
      return
    }

    const currentStartDate = new Date(startDate)
    const currentEndDate = new Date(endDate)
    const length = Math.floor((currentEndDate - currentStartDate) / (1000 * 60 * 60 * 24)) + 1

    const previousEndDateObj = new Date(currentStartDate)
    previousEndDateObj.setDate(previousEndDateObj.getDate() - 1)
    const previousEnd = previousEndDateObj.toISOString().slice(0, 10)

    const previousStartDateObj = new Date(previousEndDateObj)
    previousStartDateObj.setDate(previousStartDateObj.getDate() - length + 1)
    const previousStart = previousStartDateObj.toISOString().slice(0, 10)

    setLoading(true)
    Promise.all([
      fetch(`/api/top-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}&volumeGroupBy=${volumeGroupBy}&costPerLeadGroupBy=${costPerLeadGroupBy}`)
        .then(res => res.json()),
      fetch(`/api/qualified-leads?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
        .then(res => res.json()),
      fetch(`/api/top-metrics?clientId=${selectedClient}&start=${previousStart}&end=${previousEnd}&volumeGroupBy=${volumeGroupBy}&costPerLeadGroupBy=${costPerLeadGroupBy}`)
        .then(res => res.json())
    ])
      .then(([currentRes, leadsRes, previousRes]) => {
        if (currentRes.error) throw new Error(currentRes.error)
        if (leadsRes.error) throw new Error(leadsRes.error)
        if (previousRes.error) throw new Error(previousRes.error)
        setMetrics(currentRes.data || null)
        setLeads(leadsRes.data || [])
        setPreviousMetrics(previousRes.data || null)
      })
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

  const stats = [
    { label: 'Qualified Leads', field: 'qualified_leads', iconType: 'bar' },
    { label: 'PPC Leads', field: 'qualified_leads_ppc', iconType: 'bar' },
    { label: 'LSA Leads', field: 'qualified_leads_lsa', iconType: 'bar' },
    { label: 'SEO Leads', field: 'qualified_leads_seo', iconType: 'bar' },
    { label: 'Total Spend', field: 'spend_total', iconType: 'wallet' },
    { label: 'Total PPC Spend', field: 'spend_ppc', iconType: 'wallet' },
    { label: 'LSA Spend', field: 'spend_lsa', iconType: 'wallet' },
    { label: 'SEO Spend', field: 'spend_seo', iconType: 'wallet' },
    { label: 'CPQL Total', field: 'cpql_total', iconType: 'dollar' },
    { label: 'CPQL PPC', field: 'cpql_ppc', iconType: 'dollar' },
    { label: 'CPQL LSA', field: 'cpql_lsa', iconType: 'dollar' },
    { label: 'CPQL SEO', field: 'cpql_seo', iconType: 'dollar' },
  ]

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          {stats.map(({ label, field, iconType }) => {
            const currentValue = metrics?.sourceMetrics?.[field] ?? 0
            const previousValue = previousMetrics?.sourceMetrics?.[field] ?? 0
            const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue * 100)
            const changeAbs = Math.abs(change).toFixed(0)
            const changeText = change === 0 ? '0%' : (change > 0 ? `↑ ${changeAbs}%` : `↓ ${changeAbs}%`)
            const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
            const isCurrency = field.includes('spend') || field.includes('cpql')
            const formattedValue = isCurrency ? formatCurrency(currentValue) : formatNumber(currentValue)

            return (
              <StatCard
                key={field}
                label={label}
                value={formattedValue}
                color="text-orange-600"
                changeText={changeText}
                changeColor={changeColor}
                iconType={iconType}
              />
            )
          })}
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