// app/api/ppl-data/route.js
import { supabaseServer } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const groupBy = searchParams.get('groupBy') || 'month'

  const clientIdNum = Number(clientId)
  if (isNaN(clientIdNum))
    return Response.json({ error: 'Invalid clientId' }, { status: 400 })

  const startDate = new Date(start)
  const endDate = new Date(end)
  if (isNaN(startDate) || isNaN(endDate))
    return Response.json({ error: 'Invalid dates' }, { status: 400 })

  const fStart = startDate.toISOString().slice(0, 10)
  const fEnd = endDate.toISOString().slice(0, 10)

  console.log('Calling RPCs →', { clientId: clientIdNum, fStart, fEnd })

  try {
    // 1. Metrics
    const { data: mData, error: mErr } = await supabaseServer.rpc('get_pplmetrics_v3', {
      input_client_id: clientIdNum,
      input_start_date: fStart,
      input_end_date: fEnd,
    })

    // 2. Leads (uses p_client_id, p_start_date, p_end_date)
    const { data: lData, error: lErr } = await supabaseServer.rpc('get_pplmetrics_leads_v3', {
      p_client_id: clientIdNum,
      p_start_date: fStart,
      p_end_date: fEnd,
    })

    // 3. Line Chart (uses first_source_name)
    const { data: cData, error: cErr } = await supabaseServer.rpc('get_pplmetrics_linechartv3', {
      input_client_id: clientIdNum,
      input_start_date: fStart,
      input_end_date: fEnd,
    })

    if (mErr || lErr || cErr) {
      const msg = mErr?.message || lErr?.message || cErr?.message
      console.error('RPC error →', msg)
      return Response.json({ error: msg }, { status: 500 })
    }

    // Normalize chart to use `qualified_leads`
    const chart = (cData ?? []).map(row => ({
      date: row.date_key,
      total: row.qualified_leads ?? 0,
      ppc: 0,
      lsa: 0,
      seo: 0,
    }))

    const payload = {
      metrics: mData?.[0] ?? {},
      leads: lData ?? [],
      chart,
    }

    console.log('API payload →', payload)
    return Response.json({ data: payload })
  } catch (e) {
    console.error('Unexpected →', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}