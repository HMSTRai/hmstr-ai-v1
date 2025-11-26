// app/lead_quality_by_source/page.jsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import generatePDF, { Margin } from 'react-to-pdf'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="border border-[#f36622] rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:text-gray-200"
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
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="date"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
        className="border border-[#f36622] rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:text-gray-200 dark:[&::-webkit-calendar-picker-indicator]:invert"
      />
      <span className="text-gray-600 dark:text-gray-400">to</span>
      <input
        type="date"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
        className="border border-[#f36622] rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:text-gray-200 dark:[&::-webkit-calendar-picker-indicator]:invert"
      />
    </div>
  )
}

function SourceMetricCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-[#f36622] rounded-2xl px-6 py-5 flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-normal">{label}</p>
        <p className="text-3xl font-bold text-[#f36622] dark:text-[#f36622] mt-1">{value ?? '0'}</p>
      </div>
      <div className="w-12 h-12 rounded-full border border-[#f36622] flex items-center justify-center">
        <svg className="w-6 h-6 text-[#f36622]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
  )
}

function ChartSection({ title, children, grouping, onGroupingChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-[#f36622] rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <select
          value={grouping}
          onChange={e => onGroupingChange(e.target.value)}
          className="border border-[#f36622] rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:text-gray-200"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="h-96 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
        {children}
      </div>
    </div>
  )
}

export default function LeadQualityBySource() {
  const today = new Date().toISOString().slice(0, 10)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState(today)
  const [grouping, setGrouping] = useState('monthly')

  const [sourceCards, setSourceCards] = useState({})
  const [intakeScoreData, setIntakeScoreData] = useState([])
  const [percentQualifiedData, setPercentQualifiedData] = useState([])
  const [leadScoreData, setLeadScoreData] = useState([])
  const [closeScoreData, setCloseScoreData] = useState([])

  const [loading, setLoading] = useState(false)
  const pageRef = useRef(null)

  const exportToPDF = () => generatePDF(pageRef, { filename: `Lead_Quality_${today}.pdf`, page: { margin: Margin.MEDIUM } })

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data ?? []))
  }, [])

  useEffect(() => {
    if (!selectedClient) return
    setLoading(true)

    fetch(`/api/lead_quality_by_source?clientId=${selectedClient}&start=${startDate}&end=${endDate}&grouping=${grouping}`)
      .then(r => r.json())
      .then(({ data }) => {
        const cards = Array.isArray(data.sourceCards) ? data.sourceCards[0] : data.sourceCards || {}
        setSourceCards(cards)
        setIntakeScoreData(data.intakeScore ?? [])
        setPercentQualifiedData(data.percentQualified ?? [])
        setLeadScoreData(data.leadScore ?? [])
        setCloseScoreData(data.closeScore ?? [])
      })
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate, grouping])

  const MultiLineChart = ({ data, keys, colors, names, yDomain }) => {
    if (!data || data.length === 0)
      return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No data available</p>

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" className="dark:stroke-[#334155]" />
          <XAxis
            dataKey="period_start"
            stroke="#64748b"
            tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            tick={{ fill: '#64748b', className: 'dark:fill-[#94a3b8]' }}
          />
          <YAxis
            stroke="#64748b"
            className="dark:stroke-[#94a3b8]"
            tick={{ fill: '#64748b', className: 'dark:fill-[#94a3b8]' }}
            domain={yDomain || 'auto'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(255 255 255)',
              border: '1px solid #f36622',
              borderRadius: 8,
              color: '#1e293b',
            }}
            labelStyle={{ color: '#f36622', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {keys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i]}
              name={names[i]}
              strokeWidth={2}
              connectNulls={true}
              dot={{ r: 4, fill: colors[i] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screentext-gray-900 dark:text-white">
      <div className="px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
            <DateSelector
              startDate={startDate}
              endDate={endDate}
              onChange={(t, v) => t === 'startDate' ? setStartDate(v) : setEndDate(v)}
            />
          </div>
          <button
            onClick={exportToPDF}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-medium shadow-md transition"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Lead Qualitication Rate (%) - by Source</h1>

        {/* === ALL 4 ROWS OF CARDS EXACTLY AS BOSS REQUESTED === */}
        <div className="space-y-6 mb-12">

          {/* Row 1: Lead Qualification Rate */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <SourceMetricCard
              label="Lead Qualification Rate"
              value={sourceCards.lead_qualified_rate_all ? `${Math.round(sourceCards.lead_qualified_rate_all)}%` : '0'}
            />
            <SourceMetricCard label="Google PPC" value={sourceCards.lead_qualified_rate_google_ppc ? `${Math.round(sourceCards.lead_qualified_rate_google_ppc)}%` : '0'} />
            <SourceMetricCard label="Bing PPC" value={sourceCards.lead_qualified_rate_bing_ppc ? `${Math.round(sourceCards.lead_qualified_rate_bing_ppc)}%` : '0'} />
            <SourceMetricCard label="Google LSA" value={sourceCards.lead_qualified_rate_lsa ? `${Math.round(sourceCards.lead_qualified_rate_lsa)}%` : '0'} />
            <SourceMetricCard label="SEO" value={sourceCards.lead_qualified_rate_seo ? `${Math.round(sourceCards.lead_qualified_rate_seo)}%` : '0'} />
          </div>
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Average Qualified Lead Score - By Source</h1>
          {/* Row 2: Qualified Lead Score */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <SourceMetricCard
              label="Qualified Lead Score"
              value={sourceCards.qualified_leads_score_all ? Number(sourceCards.qualified_leads_score_all).toFixed(1) : '0'}
            />
            <SourceMetricCard value={sourceCards.qualified_leads_score_google_ppc ? Number(sourceCards.qualified_leads_score_google_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_leads_score_bing_ppc ? Number(sourceCards.qualified_leads_score_bing_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_leads_score_lsa ? Number(sourceCards.qualified_leads_score_lsa).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_leads_score_seo ? Number(sourceCards.qualified_leads_score_seo).toFixed(1) : '0'} />
          </div>
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Average Qualified Close Score - By Source</h1>
          {/* Row 3: Qualified Close Score */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <SourceMetricCard
              label="Qualified Close Score"
              value={sourceCards.qualified_close_score_all ? Number(sourceCards.qualified_close_score_all).toFixed(1) : '0'}
            />
            <SourceMetricCard value={sourceCards.qualified_close_score_google_ppc ? Number(sourceCards.qualified_close_score_google_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_close_score_bing_ppc ? Number(sourceCards.qualified_close_score_bing_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_close_score_lsa ? Number(sourceCards.qualified_close_score_lsa).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_close_score_seo ? Number(sourceCards.qualified_close_score_seo).toFixed(1) : '0'} />
          </div>
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Average Qualified Intake Score - By Source</h1>
          {/* Row 4: Qualified Intake Score */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <SourceMetricCard
              label="Qualified Intake Score"
              value={sourceCards.qualified_intake_score_all ? Number(sourceCards.qualified_intake_score_all).toFixed(1) : '0'}
            />
            <SourceMetricCard value={sourceCards.qualified_intake_score_google_ppc ? Number(sourceCards.qualified_intake_score_google_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_intake_score_bing_ppc ? Number(sourceCards.qualified_intake_score_bing_ppc).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_intake_score_lsa ? Number(sourceCards.qualified_intake_score_lsa).toFixed(1) : '0'} />
            <SourceMetricCard value={sourceCards.qualified_intake_score_seo ? Number(sourceCards.qualified_intake_score_seo).toFixed(1) : '0'} />
          </div>
        </div>

        {/* === CHARTS WITH CORRECT Y-AXIS RANGES === */}
        <div className="space-y-8">
          <ChartSection title="QLead Intake Score by Source" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={intakeScoreData}
              keys={['qlead_intake_score_google_ppc', 'qlead_intake_score_bing_ppc', 'qlead_intake_score_lsa', 'qlead_intake_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
              yDomain={[3, 5]}
            />
          </ChartSection>
        <ChartSection title="% Leads Qualified by Source" grouping={grouping} onGroupingChange={setGrouping}>
        <MultiLineChart
        data={percentQualifiedData}
        keys={[
        'lead_qualified_rate_google_ppc',
        'lead_qualified_rate_bing_ppc',
        'lead_qualified_rate_lsa',
        'lead_qualified_rate_seo'
        ]}
        colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
        names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
        yDomain={[0, 100]}  // ← also add this for % chart!
        />
        </ChartSection>
          <ChartSection title="QLead Lead Score by Source" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={leadScoreData}
              keys={['qlead_lead_score_google_ppc', 'qlead_lead_score_bing_ppc', 'qlead_lead_score_lsa', 'qlead_lead_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
              yDomain={[3, 5]}
            />
          </ChartSection>

          <ChartSection title="QLead Close Score by Source" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={closeScoreData}
              keys={['qlead_close_score_google_ppc', 'qlead_close_score_bing_ppc', 'qlead_close_score_lsa', 'qlead_close_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
              yDomain={[3, 5]}
            />
          </ChartSection>
        </div>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 text-gray-900 dark:text-gray-100">
          Loading...
        </div>
      )}
    </div>
  )
}