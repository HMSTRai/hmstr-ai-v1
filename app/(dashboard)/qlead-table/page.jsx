'use client'

import { useEffect, useState } from 'react'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
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
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400 dark:text-gray-500">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
      />
    </div>
  )
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-gray-200">{title}</h3>}
      {children}
    </section>
  )
}

function highlightText(text, query) {
  if (!query) return text
  const parts = text.toString().split(new RegExp(`(${query})`, 'gi'))
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.toLowerCase() === query.toLowerCase() ? 'bg-yellow-200 dark:bg-yellow-800' : ''}>
          {part}
        </span>
      ))}
    </>
  )
}

function LeadsTable({ leads }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLeads = leads.filter(lead =>
    Object.values(lead).some(value =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const indexOfLastLead = currentPage * rowsPerPage
  const indexOfFirstLead = indexOfLastLead - rowsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead)

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage)

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <SectionCard title="Qualified Leads Table">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full sm:w-1/3 border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200 dark:placeholder:text-gray-400"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Show</span>
          <select
            className="border rounded-lg px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">First Contact Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Customer Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Customer Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Customer City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Customer State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Service Inquired</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Lead Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Close Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Human Engaged</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">First Source</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.first_contact_date || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.customer_phone_number || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.customer_name || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.customer_city || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.customer_state || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.service_inquired || '--', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.lead_score_max || 0, searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.close_score_max || 0, searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.human_engaged ? 'Yes' : 'No', searchQuery)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{highlightText(lead.first_source || '--', searchQuery)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No qualified leads found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Show</span>
          <select
            className="border rounded-lg px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 text-sm text-gray-600 dark:text-gray-400 ${currentPage === 1 ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}`}
          >
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 text-sm ${currentPage === page ? 'bg-indigo-500 text-white rounded' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 text-sm text-gray-600 dark:text-gray-400 ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </SectionCard>
  )
}

export default function ModernDashboard() {
  const today = new Date().toISOString().slice(0, 10)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      setLeads([])
      return
    }
    setLoading(true)
    fetch(`/api/qualified-leads?clientId=${selectedClient}&start=${startDate}&end=${endDate}`)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error)
        setLeads(data || [])
        console.log('Fetched Leads:', data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedClient, startDate, endDate])

  return (
    //background color
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
       <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      <div className="w-full px-2 sm:px-4 md:px-6">
        <LeadsTable leads={leads} />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 text-gray-900 dark:text-gray-100">
          Loading...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full flex justify-center p-2 sm:p-3 md:p-4">
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2 rounded">{error}</div>
        </div>
      )}
    </div>
  )
}