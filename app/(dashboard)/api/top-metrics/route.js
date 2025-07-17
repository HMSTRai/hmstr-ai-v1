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

  // Call your main top metrics RPC
  const { data, error } = await supabase.rpc('get_qlead_data', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Call your call engagement metrics RPC separately
  const { data: engagementData, error: engagementError } = await supabase.rpc('get_call_engagement_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (engagementError) {
    // Log error but continue returning main metrics
    console.error('Engagement metrics error:', engagementError.message)
  }

  const dates = getDatesInRange(start, end)

  // Prepare get_qleadvolume_linechart data
  const get_qleadvolume_linechart = dates.map(date => {
    const dayData = data.find(d => d.date === date)
    return {
      date,
      total: dayData?.qualified_leads ?? 0,
      ppc: dayData?.qualified_leads_ppc ?? 0,
      lsa: dayData?.qualified_leads_lsa ?? 0,
      seo: dayData?.qualified_leads_seo ?? 0,
    }
  })

  // Prepare get_qleadcostper_linechart data
  const get_qleadcostper_linechart = dates.map(date => {
    const dayData = data.find(d => d.date === date)
    return {
      date,
      total: dayData?.cpql_total ?? 0,
      ppc: dayData?.cpql_ppc ?? 0,
      lsa: dayData?.cpql_lsa ?? 0,
      seo: dayData?.cpql_seo ?? 0,
    }
  })

  // Grab totals from first data row or empty object
  const totals = data.length > 0 ? data[0] : {}

  // For engagement metrics, just pick the first row of engagementData if available
  const engagementTotals = (engagementData && engagementData.length > 0) ? engagementData[0] : {}

  // Map your engagement fields to friendly names expected in frontend
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
      get_qleadvolume_linechart,
      get_qleadcostper_linechart,
    }
  })
}
