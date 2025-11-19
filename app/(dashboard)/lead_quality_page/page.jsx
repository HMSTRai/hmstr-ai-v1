'use client'

import { useEffect, useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useDarkmode from '@/hooks/useDarkMode'
import generatePDF, { Margin } from 'react-to-pdf'

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

function StatCard({ label, value, iconType = 'bar' }) {
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
      <div className="ml-4">
        <div className="w-10 h-10 rounded-full border border-[#f36622]/30 dark:border-[#f36622] flex items-center justify-center">
          {icons[iconType]}
        </div>
      </div>
    </div>
  )
}

function ChartSection({ title, children }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 md:p-6 mb-6 border border-[#f36622]">
      <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="h-80 bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
        {children}
      </div>
    </section>
  )
}

export default function LeadQualityBySourceDashboard() {
  const [isDark] = useDarkmode()
  const today = new Date().toISOString().slice(0, 10)

  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('2025-10-01')
  const [endDate, setEndDate] = useState(today)

  const [sourceCards, setSourceCards] = useState({})
  const [intakeScoreData, setIntakeScoreData] = useState([])
  const [percentQualifiedData, setPercentQualifiedData] = useState([])
  const [leadScoreData, setLeadScoreData] = useState([])
  const [closeScoreData, setCloseScoreData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const pageRef = useRef(null)

  const exportToPDF = () => {
    generatePDF(pageRef, {
      filename: `Lead_Quality_By_Source_${today}.pdf`,
      page: { margin: Margin.MEDIUM },
      overrides: { pdf: { compress: true }, canvas: { useCORS: true } },
    })
  }

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(({ data }) => setClients(data ?? []))
      .catch(() => setError('Failed to load clients'))
  }, [])

  useEffect(() => {
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setSourceCards({})
      setIntakeScoreData([]); setPercentQualifiedData([]); setLeadScoreData([]); setCloseScoreData([])
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/api/lead_quality_by_source?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(({ data }) => {
        setSourceCards(data.sourceCards?.[0] ?? {})
        setIntakeScoreData(data.intakeScore ?? [])
        setPercentQualifiedData(data.percentQualified ?? [])
        setLeadScoreData(data.leadScore ?? [])
        setCloseScoreData(data.closeScore ?? [])
      })
      .catch(e => setError(e.message || e))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  const chartConfig = {
    textColor: isDark ? '#e5e7eb' : '#374151',
    gridColor: isDark ? '#374151' : '#e5e7eb',
    tooltipBg: isDark ? '#1f2937' : '#ffffff',
    tooltipText: isDark ? '#ffffff' : '#374151',
  }

  const renderLineChart = (data, dataKey, title) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
        <XAxis dataKey="date" tick={{ fill: chartConfig.textColor }} />
        <YAxis tick={{ fill: chartConfig.textColor }} />
        <Tooltip
          contentStyle={{ backgroundColor: chartConfig.tooltipBg, color: chartConfig.tooltipText, border: 'none', borderRadius: 8 }}
        />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#f36622" strokeWidth={3} dot={{ fill: '#f36622' }} name={title} />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <div ref={pageRef} className="pb-16 min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 px-4 md:px-6 bg-white dark:bg-slate-800 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            onChange={(type, val) => type === 'startDate' ? setStartDate(val) : setEndDate(val)}
          />
        </div>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to PDF
        </button>
      </div>

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Lead Quality By Source</h1>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Qualified Leads" value={sourceCards.qualified_leads ?? 0} />
          <StatCard label="PPC Leads" value={sourceCards.ppc_leads ?? 0} />
          <StatCard label="LSA Leads" value={sourceCards.lsa_leads ?? 0} />
          <StatCard label="SEO Leads" value={sourceCards.seo_leads ?? 0} />
          <StatCard label="SFO Leads" value={sourceCards.sfo_leads ?? 0} />
        </div>

        {/* Charts */}
        <ChartSection title="QLead Intake Score by Source Line Chart">
          {intakeScoreData.length ? renderLineChart(intakeScoreData, 'intake_score', 'Intake Score') : <div className="flex items-center justify-center h-full text-gray-500">No data available</div>}
        </ChartSection>

        <ChartSection title="% Leads Qualified by Source Line Chart">
          {percentQualifiedData.length ? renderLineChart(percentQualifiedData, 'percent_qualified', '% Qualified') : <div className="flex items-center justify-center h-full text-gray-500">No data available</div>}
        </ChartSection>

        <ChartSection title="QLead Lead Score by Source Line Chart">
          {leadScoreData.length ? renderLineChart(leadScoreData, 'lead_score', 'Lead Score') : <div className="flex items-center justify-center h-full text-gray-500">No data available</div>}
        </ChartSection>

        <ChartSection title="QLead Close Score by Source Line Chart">
          {closeScoreData.length ? renderLineChart(closeScoreData, 'close_score', 'Close Score') : <div className="flex items-center justify-center h-full text-gray-500">No data available</div>}
        </ChartSection>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg z-50">
          {error}
        </div>
      )}
    </div>
  )
}