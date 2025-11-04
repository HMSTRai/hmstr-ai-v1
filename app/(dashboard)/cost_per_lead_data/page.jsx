'use client'

import { useEffect, useState, useRef } from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useDarkmode from '@/hooks/useDarkMode'
import generatePDF, { Margin } from 'react-to-pdf'  // PDF export

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
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLeads = leads.filter(lead =>
    Object.values(lead).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filteredLeads.length / pageSize)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return

    const headers = [
      'First Contact Date', 'Customer Phone', 'Customer Name', 'Customer City', 'Customer State',
      'Service Inquired', 'Lead Score', 'Close Score', 'Human Engaged', 'First Source',
    ]

    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.first_contact_date || '',
        lead.customer_phone_number || '',
        lead.customer_name || '',
        lead.customer_city || '',
        lead.customer_state || '',
        lead.service_inquired || '',
        lead.lead_score_max || '',
        lead.close_score_max || '',
        lead.human_engaged ? 'Yes' : 'No',
        lead.first_source || '',
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Pay_Per_Lead_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <SectionCard title="Pay Per Lead">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full sm:w-64 px-3 py-2 border border-[#f36622] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
        />
        <div className="flex flex-col sm:flex-row items-end gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Show</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 border border-[#f36622] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-600 dark:text-gray-400">entries</span>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2 bg-[#f36622] text-white rounded-lg text-sm hover:bg-[#e55a10] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              {[
                'First Contact Date', 'Customer Phone', 'Customer Name', 'Customer City', 'Customer State',
                'Service Inquired', 'Lead Score', 'Close Score', 'Human Engaged', 'First Source',
              ].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length ? paginatedLeads.map((lead, i) => (
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} entries
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#f36622] rounded hover:bg-[#f36622]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#f36622] rounded hover:bg-[#f36622]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export default function CostPerLeadDashboard() {
  const [isDark] = useDarkmode()
  const today = new Date().toISOString().slice(0, 10)

  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('2025-10-01')
  const [endDate, setEndDate] = useState(today)

  const [metrics, setMetrics] = useState({})
  const [leads, setLeads] = useState([])
  const [chartData, setChartData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Ref to capture the entire page
  const pageRef = useRef(null)

  // PDF Export Function
  const exportToPDF = () => {
    generatePDF(pageRef, {
      filename: `Cost_Per_Lead_Report_${today}.pdf`,
      page: { margin: Margin.MEDIUM },
      overrides: {
        pdf: {
          compress: true,
        },
        canvas: {
          useCORS: true,
        },
      },
    })
  }

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
    <div ref={pageRef} className="pb-16">
      {/* Header with Client, Date, and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
          />
        </div>

        {/* Export to PDF Button - Right next to Date */}
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to PDF
        </button>
      </div>

      <div className="w-full px-2 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 mt-2 sm:mt-4 text-gray-900 dark:text-gray-100">
          Cost Per Lead Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <StatCard label="Qualified Leads" value={metrics.qualified_leads ?? 0} iconType="bar" />
          <StatCard label="Unique Callers" value={metrics.unique_callers ?? 0} iconType="bar" />
          <StatCard label="Pct Leads Qualified" value={`${metrics.pct_leads_qualified ?? 0}%`} iconType="bar" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-10 w-full">
        <SectionCard title="Pay Per Lead">
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