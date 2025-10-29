// app/api/ppl-data/route.js
import { supabaseServer } from '@/lib/supabaseClient'

function getDatesInRange(start, end, groupBy = 'day') {
  const dates = []
  let cur = new Date(start)
  const endDate = new Date(end)

  while (cur <= endDate) {
    let dateStr = cur.toISOString().slice(0, 10)

    if (groupBy === 'week') {
      const day = cur.getDay()
      const sub = day === 0 ? 6 : day - 1
      cur.setDate(cur.getDate() - sub)
      dateStr = cur.toISOString().slice(0, 10)
    } else if (groupBy === 'month') {
      cur.setDate(1)
      dateStr = cur.toISOString().slice(0, 10)
    }

    if (!dates.includes(dateStr) && new Date(dateStr) <= endDate) dates.push(dateStr)

    if (groupBy === 'week') cur.setDate(cur.getDate() + 7)
    else if (groupBy === 'month') cur.setMonth(cur.getMonth() + 1)
    else cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const groupBy = searchParams.get('groupBy') || 'month'

  const clientIdNum = Number(clientId)
  if (isNaN(clientIdNum)) return Response.json({ error: 'Invalid clientId' }, { status: 400 })

  const startDate = new Date(start)
  const endDate = new Date(end)
  if (isNaN(startDate) || isNaN(endDate))
    return Response.json({ error: 'Invalid dates' }, { status: 400 })

  const fStart = startDate.toISOString().slice(0, 10)
  const fEnd = endDate.toISOString().slice(0, 10)

  // 1. Metrics
  const { data: mData, error: mErr } = await supabaseServer.rpc('get_pplmetrics_v3', {
    input_client_id: clientIdNum,
    input_start_date: fStart,
    input_end_date: fEnd,
  })

  // 2. Leads
  const { data: lData, error: lErr } = await supabaseServer.rpc('get_pplmetrics_leads_v3', {
    input_client_id: clientIdNum,
    input_start_date: fStart,
    input_end_date: fEnd,
  })

  // 3. Chart
  const { data: cData, error: cErr } = await supabaseServer.rpc('get_pplmetrics_linechartv3', {
    input_client_id: clientIdNum,
    input_start_date: fStart,
    input_end_date: fEnd,
    input_group_by: groupBy,
  })

  if (mErr || lErr || cErr) {
    const msg = mErr?.message || lErr?.message || cErr?.message
    console.error('RPC error →', msg)
    return Response.json({ error: msg }, { status: 500 })
  }

  const dates = getDatesInRange(fStart, fEnd, groupBy)
  const chart = dates.map(d => {
    const row = (cData ?? []).find(r => r.date_key?.slice(0, 10) === d) ?? {}
    return {
      date: d,
      total: row.cpql_total ?? 0,
      ppc: row.cpql_ppc ?? 0,
      lsa: row.cpql_lsa ?? 0,
      seo: row.cpql_seo ?? 0,
    }
  })

  return Response.json({
    data: {
      metrics: mData?.[0] ?? {},
      leads: lData ?? [],
      chart,
    },
  })
}