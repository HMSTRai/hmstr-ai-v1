'use client'

import { useEffect, useState } from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useDarkmode from '@/hooks/useDarkMode'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="w-full sm:w-auto border border-[#f36622] rounded-lg px-3 sm:px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
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
        className="w-full sm:w-auto border border-[#f36622] rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400 dark:text-gray-500">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border border-[#f36622] rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
      />
    </div>
  )
}

function StatCard({ label, value, iconType }) {
  const icons = {
    bar: (
      <svg className="w-5 h-5 text-[#f36622]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="4" y="10" width="4" height="10" />
        <rect x="10" y="4" width="4" height="16" />
        <rect x="16" y="8" width="4" height="12" />
      </svg>
    ),
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex justify-between items-start min-w-[120px] transition hover:shadow-lg hover:bg-[#f36622]/5 dark:hover:bg-slate-700 border border-[#f36622]">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-2xl sm:text-3xl font-bold text-[#f36622]">{value}</span>
      </div>
      {iconType && (
        <div className="ml-4">
          <div className="w-10 h-10 rounded-full border border-[#f36622]/30 dark:border-[#f36622] flex items-center justify-center">
            {icons[iconType]}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8 border border-[#f36622]">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-gray-200">{title}</h3>}
      {children}
    </section>
  )
}

function LeadsTable({ leads }) {
  return (
    <SectionCard title="Pay Per Lead - Table of Qualified Leads">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              {[
                'First Contact Date','Customer Phone','Customer Name','Customer City','Customer State',
                'Service Inquired','Lead Score','Close Score','Human Engaged','First Source',
              ].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length ? leads.map((lead, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.first_contact_date || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.customer_phone_number || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.customer_name || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.customer_city || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.customer_state || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.service_inquired || '--'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.lead_score_max ?? 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.close_score_max ?? 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.human_engaged ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{lead.first_source || '--'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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

export default function CostPerLeadDashboard() {
  const [isDark] = useDarkmode()
  const today = new Date().toISOString().slice(0, 10)

  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const [metrics, setMetrics] = useState({})
  const [leads, setLeads] = useState([])
  const [chartData, setChartData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(({ data, error: err }) => {
        if (err) throw new Error(err)
        setClients(data ?? [])
      })
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => {
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setMetrics({}); setLeads([]); setChartData([])
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/api/ppl-data?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(({ data, error: err }) => {
        if (err) throw new Error(err)
        console.log('Received →', data)
        setMetrics(data.metrics || {})
        setLeads(data.leads || [])
        setChartData(data.chart || [])
      })
      .catch(e => {
        console.error('Fetch error →', e)
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  const textColor = isDark ? '#e5e7eb' : '#374151'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipText = isDark ? '#ffffff' : '#374151'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      <div className="w-full px-2 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 mt-2 sm:mt-4 text-gray-900 dark:text-gray-100">
          Cost Per Lead Data [cost_per_lead_data]
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <StatCard label="Qualified Leads" value={metrics.qualified_leads ?? 0} iconType="bar" />
          <StatCard label="Unique Callers" value={metrics.unique_callers ?? 0} iconType="bar" />
          <StatCard label="Pct Leads Qualified" value={`${metrics.pct_leads_qualified ?? 0}%`} iconType="bar" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-10 w-full">
        <SectionCard title="Pay Per Lead - Line Chart">
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f36622" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f36622" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="date" tick={{ fontSize: 13, fill: textColor }} />
                <YAxis tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
                  labelStyle={{ fontWeight: 600, color: tooltipText }}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />

                <Line type="monotone" dataKey="total" stroke="#f36622" strokeWidth={2} fill="url(#colorTotal)" name="Qualified Leads" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <LeadsTable leads={leads} />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 text-gray-900 dark:text-gray-100">
          Loading…
        </div>
      )}
      {error && (
        <div className="fixed inset-x-0 top-4 flex justify-center">
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-2 rounded max-w-lg break-words">
            {error}
          </div>
        </div>
      )}
    </div>
  )
}