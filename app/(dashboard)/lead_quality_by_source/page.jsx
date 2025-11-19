'use client'

import { useEffect, useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import generatePDF, { Margin } from 'react-to-pdf'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="bg-slate-800 border border-[#f36622] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f36622]"
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
    <div className="flex items-center gap-3 text-white">
      <input type="date" value={startDate} onChange={e => onChange('startDate', e.target.value)}
        className="bg-slate-800 border border-[#f36622] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f36622]" />
      <span>to</span>
      <input type="date" value={endDate} onChange={e => onChange('endDate', e.target.value)}
        className="bg-slate-800 border border-[#f36622] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f36622]" />
    </div>
  )
}

function SourceMetricCard({ label, value }) {
  return (
    <div className="bg-slate-800 border border-[#f36622] rounded-2xl px-6 py-5 flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value ?? 0}</p>
      </div>
      <div className="w-12 h-12 rounded-full border-2 border-[#f36622] flex items-center justify-center">
        <svg className="w-6 h-6 text-[#f36622]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
  )
}

function ChartSection({ title, children, grouping, onGroupingChange }) {
  return (
    <div className="bg-slate-900 border border-[#f36622] rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <select value={grouping} onChange={e => onGroupingChange(e.target.value)}
          className="bg-slate-800 border border-[#f36622] text-white rounded-lg px-4 py-2 text-sm">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="h-96 bg-slate-800/60 rounded-xl border border-dashed border-slate-600">
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

  const MultiLineChart = ({ data, keys, colors, names }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center">No data available</p>

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
          <XAxis
            dataKey="period_start"
            stroke="#94a3b8"
            tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #f36622', borderRadius: 8 }} />
          <Legend />
          {keys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i]}
              name={names[i]}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-b from-slate-900 to-black border-b border-[#f36622]/30 px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
            <DateSelector startDate={startDate} endDate={endDate}
              onChange={(t, v) => t === 'startDate' ? setStartDate(v) : setEndDate(v)} />
          </div>
          <button onClick={exportToPDF} className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg">
            Export to PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Lead Quality By Source</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <SourceMetricCard label="Qualified Leads" value={sourceCards.lead_qualified_total} />
          <SourceMetricCard label="PPC Leads" value={sourceCards.ppc_leads} />
          <SourceMetricCard label="LSA Leads" value={sourceCards.lsa_leads} />
          <SourceMetricCard label="SEO Leads" value={sourceCards.seo_leads} />
          <SourceMetricCard label="SFO Leads" value={sourceCards.sfo_leads} />
        </div>

        <div className="space-y-8">
          <ChartSection title="QLead Intake Score by Source Line Chart" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={intakeScoreData}
              keys={['qlead_intake_score_google_ppc', 'qlead_intake_score_bing_ppc', 'qlead_intake_score_lsa', 'qlead_intake_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
            />
          </ChartSection>

          <ChartSection title="% Leads Qualified by Source Line Chart" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={percentQualifiedData}
              keys={['qlead_qualified_rate_google_ppc', 'qlead_qualified_rate_bing_ppc', 'qlead_qualified_rate_lsa', 'qlead_qualified_rate_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
            />
          </ChartSection>

          <ChartSection title="QLead Lead Score by Source Line Chart" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={leadScoreData}
              keys={['qlead_lead_score_google_ppc', 'qlead_lead_score_bing_ppc', 'qlead_lead_score_lsa', 'qlead_lead_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
            />
          </ChartSection>

          <ChartSection title="QLead Close Score by Source Line Chart" grouping={grouping} onGroupingChange={setGrouping}>
            <MultiLineChart
              data={closeScoreData}
              keys={['qlead_close_score_google_ppc', 'qlead_close_score_bing_ppc', 'qlead_close_score_lsa', 'qlead_close_score_seo']}
              colors={['#f97316', '#3b82f6', '#8b5cf6', '#10b981']}
              names={['Google PPC', 'Bing PPC', 'LSA', 'SEO']}
            />
          </ChartSection>
        </div>
      </div>

      {loading && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 text-2xl text-white">Loading...</div>}
    </div>
  )
}