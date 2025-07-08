'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const StarterPage = () => {
  const [calls, setCalls] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('callrail_calls')
        .select('id, created_at, callrail_call_id, company_name, start_time')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) console.error(error)
      else setCalls(data)
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📞 Latest Calls</h1>
      <table className="w-full text-left text-sm border border-gray-300">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Call ID</th>
            <th className="p-2">Company</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Start Time</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call, index) => (
            <tr key={call.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{call.callrail_call_id}</td>
              <td className="p-2">{call.company_name}</td>
              <td className="p-2">{new Date(call.created_at).toLocaleString()}</td>
              <td className="p-2">{new Date(call.start_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StarterPage
