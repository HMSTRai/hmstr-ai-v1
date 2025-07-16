import { supabase } from '@/lib/supabaseClient'

function getDatesInRange(start, end) {
  const dates = []
  let current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    dates.push(current.toISOString().slice(0, 10))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  // Call the new get_qlead_data RPC
  const { data, error } = await supabase.rpc('get_qlead_data', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Note: If you still need call engagement metrics from separate RPC, call it here as before
  // Or if get_qlead_data returns these already, remove below section

  // For now, I'll assume engagement metrics still come from the other RPC
  const { data: engagementData, error: engagementError } = await supabase.rpc('get_call_engagement_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (engagementError) {
    console.error('Engagement metrics error:', engagementError.message)
  }

  // Generate dates array for charts
  const dates = getDatesInRange(start, end)

  // Prepare leads_chart data
  const leads_chart = dates.map(date => {
    const dayData = data.find(d => d.date === date) || {}
    return {
      date,
      total: dayData.qualified_leads ?? 0,
      ppc: dayData.qualified_leads_ppc ?? 0,
      lsa: dayData.qualified_leads_lsa ?? 0,
      seo: dayData.qualified_leads_seo ?? 0,
    }
  })

  // Prepare cpql_chart data
  const cpql_chart = dates.map(date => {
    const dayData = data.find(d => d.date === date) || {}
    return {
      date,
      total: dayData.cpql_total ?? 0,
      ppc: dayData.cpql_ppc ?? 0,
      lsa: dayData.cpql_lsa ?? 0,
      seo: dayData.cpql_seo ?? 0,
    }
  })

  // Get totals from first data row or empty object
  const totals = data.length > 0 ? data[0] : {}

  // Engagement metrics mapping from engagementData
  const engagementTotals = engagementData && engagementData.length > 0 ? engagementData[0] : {}

  const engagementMetrics = {
    human_engagement_rate: engagementTotals.her_percent ?? null,
    ai_forward_rate: engagementTotals.aifr_percent ?? null,
    human_engaged_count: engagementTotals.human_engaged_true ?? null,
    human_total_count: engagementTotals.total_engagements ?? null,
    ai_forward_count: engagementTotals.ai_forwarded ?? null,
    ai_total_count: engagementTotals.total_forwarded ?? null,
  }

  return Response.json({
    data: {
      ...totals,
      ...engagementMetrics,
      leads_chart,
      cpql_chart,
    }
  })
}
