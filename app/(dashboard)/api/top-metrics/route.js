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

  // Fetch qualified leads and CPQL
  const { data: qleadData, error: qleadError } = await supabase.rpc('get_top_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (qleadError) {
    return Response.json({ error: qleadError.message }, { status: 500 })
  }

  // Fetch call engagement metrics
  const { data: engagementData, error: engagementError } = await supabase.rpc('get_call_engagement_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (engagementError) {
    console.error('Engagement metrics error:', engagementError.message)
  }

  // Fetch qualified leads volume line chart data
  const { data: volumeData, error: volumeError } = await supabase.rpc('get_qleadvolume_linechart', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
    input_group_by: 'day', // you can customize to week/month if needed
  })

  if (volumeError) {
    console.error('Volume chart error:', volumeError.message)
  }

  // Fetch qualified leads cost per lead line chart data
  const { data: costPerData, error: costPerError } = await supabase.rpc('get_qleadcostper_linechart', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
    input_group_by: 'day',
  })

  if (costPerError) {
    console.error('Cost per lead chart error:', costPerError.message)
  }

  // Generate date array for chart filling
  const dates = getDatesInRange(start, end)

  // Prepare leads_chart filling missing dates with zeros
  const leads_chart = dates.map(date => {
    const day = qleadData.find(d => d.date === date) || {}
    return {
      date,
      total: day.qualified_leads ?? 0,
      ppc: day.qualified_leads_ppc ?? 0,
      lsa: day.qualified_leads_lsa ?? 0,
      seo: day.qualified_leads_seo ?? 0,
    }
  })

  // Prepare cpql_chart similarly
  const cpql_chart = dates.map(date => {
    const day = qleadData.find(d => d.date === date) || {}
    return {
      date,
      total: day.cpql_total ?? 0,
      ppc: day.cpql_ppc ?? 0,
      lsa: day.cpql_lsa ?? 0,
      seo: day.cpql_seo ?? 0,
    }
  })

  // Prepare volume_chart filling missing dates with zeros
  const volume_chart = dates.map(date => {
    const day = volumeData.find(d => d.group_date === date) || {}
    return {
      date,
      total: day.qualified_leads ?? 0,
      ppc: day.qualified_leads_ppc ?? 0,
      lsa: day.qualified_leads_lsa ?? 0,
      seo: day.qualified_leads_seo ?? 0,
    }
  })

  // Prepare cost_per_lead_chart similarly
  const cost_per_lead_chart = dates.map(date => {
    const day = costPerData.find(d => d.group_date === date) || {}
    return {
      date,
      total: day.cpql_total ?? 0,
      ppc: day.cpql_ppc ?? 0,
      lsa: day.cpql_lsa ?? 0,
      seo: day.cpql_seo ?? 0,
    }
  })

  // Totals from first row of qualified leads data or empty object
  const totals = qleadData.length > 0 ? qleadData[0] : {}

  // Engagement metrics mapping
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
      volume_chart,
      cost_per_lead_chart,
    },
  })
}
