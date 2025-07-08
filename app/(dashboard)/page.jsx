'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

export default function ClientDashboard({ startDate, endDate, client }) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase.rpc('dashboard_insights', {
        start_date: startDate,
        end_date: endDate,
        client,
      })

      if (error) console.error(error)
      else setMetrics(data)

      setLoading(false)
    }

    fetchData()
  }, [startDate, endDate, client])

  if (loading) return <p>Loading...</p>
  if (!metrics) return <p>No data</p>

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Total Leads</p>
          <p className="text-xl font-semibold">{metrics.leads}</p>
        </div>
        <div>
          <p className="text-gray-500">PPC Leads</p>
          <p className="text-xl">{metrics.ppc_leads}</p>
        </div>
        <div>
          <p className="text-gray-500">LSA Leads</p>
          <p className="text-xl">{metrics.lsa_leads}</p>
        </div>
        <div>
          <p className="text-gray-500">SEO Leads</p>
          <p className="text-xl">{metrics.seo_leads}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Spend</p>
          <p className="text-xl">${metrics.total_spend?.toFixed(2)}</p>
        </div>
      </div>

      {/* Qualified Leads Line Chart */}
      <div>
        <h2 className="text-lg font-bold mb-2">Qualified Leads by Period</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatLeads(metrics.qualified_by_day)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="PPC" stroke="#8884d8" />
            <Line type="monotone" dataKey="LSA" stroke="#82ca9d" />
            <Line type="monotone" dataKey="SEO" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CPL Line Chart */}
      <div>
        <h2 className="text-lg font-bold mb-2">Cost per Qualified Lead by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatCPL(metrics.cpl_by_month)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="PPC" stroke="#8884d8" />
            <Line type="monotone" dataKey="LSA" stroke="#82ca9d" />
            <Line type="monotone" dataKey="SEO" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Utilities to reshape RPC JSON to Recharts format
function formatLeads(data) {
  const grouped = {}
  data?.forEach(({ date, source, total }) => {
    const key = dayjs(date).format('YYYY-MM-DD')
    grouped[key] = grouped[key] || { date: key }
    grouped[key][source] = total
  })
  return Object.values(grouped)
}

function formatCPL(data) {
  const grouped = {}
  data?.forEach(({ month, source, cpl }) => {
    const key = dayjs(month).format('YYYY-MM')
    grouped[key] = grouped[key] || { month: key }
    grouped[key][source] = parseFloat(cpl)
  })
  return Object.values(grouped)
}
