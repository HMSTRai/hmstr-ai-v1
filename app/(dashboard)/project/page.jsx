'use client'

import { useEffect, useState } from 'react'

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

function SectionCard({ children, title }) {
  return (
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">{title}</h3>}
      {children}
    </section>
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

      <div className="w-full px-2 sm:px-4 md:px-6">
        <LeadsTable leads={leads} />
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