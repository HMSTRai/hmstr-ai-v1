'use client'

import { useEffect, useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useDarkmode from '@/hooks/useDarkMode'
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

function SourceCard({ label, value }) {
  return (
    <div className="bg-slate-800 border border-[#f36622] rounded-2xl p-5 flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value ?? 0}</p>
      </div>
      <div className="w-12 h-12 rounded-full border-2 border-[#f36622] flex items-center justify-center">
        <svg className="w-6 h-6 text-[#f36622]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
    </div>
  )
}

function ChartContainer({ title, children, showMonthly = true }) {
  return (
    <div className="bg-slate-900 border border-[#f36622] rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {showMonthly && (
          <select className="bg-slate-800 border border-[#f36622] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f36622]">
            <option>Monthly</option>
          </select>
        )}
      </div>
      <div className="h-96 bg-slate-800/50 rounded-xl flex items-center justify-center border border-dashed border-gray-600">
        {children}
      </div>
    </div>
  )
}

export default function LeadQualityBySource() {
  const [isDark] = useDarkmode()
  const today = new Date().toISOString().slice(0, 10)

  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('2025-11-01')
  const [endDate, setEndDate] = useState(today)

  const [sourceData, setSourceData] = useState({})
  const [intakeChart, setIntakeChart] = useState([])
  const [qualifiedChart, setQualifiedChart] = useState([])
  const [leadScoreChart, setLeadScoreChart] = useState([])
  const [closeScoreChart, setCloseScoreChart] = useState([])

  const [loading, setLoading] = useState(false)
  const pageRef = useRef(null)

  const exportToPDF = () => {
    generatePDF(pageRef, {
      filename: `Lead_Quality_By_Source_${today}.pdf`,
      page: { margin: Margin.MEDIUM },
    })
  }

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data ?? []))
  }, [])

  useEffect(() => {
    if (!selectedClient || !startDate || !endDate) return

    setLoading(true)
    fetch(`/api/lead_quality_by_source?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(r => r.json())
      .then(({ data }) => {
        setSourceData(data.sourceCards?.[0] ?? {})
        setIntakeChart(data.intakeScore ?? [])
        setQualifiedChart(data.percentQualified ?? [])
        setLeadScoreChart(data.leadScore ?? [])
        setCloseScoreChart(data.closeScore ?? [])
      })
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  const renderChart = (data, key) => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500 text-lg">No data available</p>
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #f36622', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
          />
          <Line type="monotone" dataKey={key} stroke="#f36622" strokeWidth={3} dot={{ fill: '#f36622', r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-black border-b border-[#f36622]/30 px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
            <DateSelector startDate={startDate} endDate={endDate}
              onChange={(type, val) => type === 'startDate' ? setStartDate(val) : setEndDate(val)} />
          </div>
          <button onClick={exportToPDF}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg flex items-center gap-2 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Lead Quality By Source</h1>

        {/* 5 Source Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <SourceCard label="Qualified Leads" value={sourceData.qualified_leads} />
          <SourceCard label="PPC Leads" value={sourceData.ppc_leads} />
          <SourceCard label="LSA Leads" value={sourceData.lsa_leads} />
          <SourceCard label="SEO Leads" value={sourceData.seo_leads} />
          <SourceCard label="SFO Leads" value={sourceData.sfo_leads} />
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <ChartContainer title="QLead Intake Score by Source Line Chart">
            {renderChart(intakeChart, 'intake_score')}
          </ChartContainer>

          <ChartContainer title="% Leads Qualified by Source Line Chart">
            {renderChart(qualifiedChart, 'percent_qualified')}
          </ChartContainer>

          <ChartContainer title="QLead Lead Score by Source Line Chart">
            {renderChart(leadScoreChart, 'lead_score')}
          </ChartContainer>

          <ChartContainer title="QLead Close Score by Source Line Chart">
            {renderChart(closeScoreChart, 'close_score')}
          </ChartContainer>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  )
}