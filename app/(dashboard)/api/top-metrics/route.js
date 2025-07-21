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
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  console.log('Calling RPC with params:', { clientId, start, end });

  const clientIdNum = Number(clientId);
  if (isNaN(clientIdNum)) {
    return Response.json({ error: 'Invalid clientId parameter' }, { status: 400 });
  }

  // et_qlead_data
  const { data, error } = await supabase.rpc('get_qlead_data', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

// get_call_engagement_metrics
  const { data: engagementData, error: engagementError } = await supabase.rpc('get_call_engagement_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  });

  if (engagementError) {
    console.error('Engagement metrics error:', engagementError.message);
  }

  const dates = getDatesInRange(start, end)

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

  const totals = data.length > 0 ? data[0] : {}

  const engagementTotals = (engagementData && engagementData.length > 0) ? engagementData[0] : {}

  const engagementMetrics = {
    human_engagement_rate: engagementTotals.her_percent ?? null,
    ai_forward_rate: engagementTotals.aifr_percent ?? null,
    human_engaged_count: engagementTotals.human_engaged_true ?? null,
    human_total_count: engagementTotals.total_engagements ?? null,
    ai_forward_count: engagementTotals.ai_forwarded ?? null,
    ai_total_count: engagementTotals.total_forwarded ?? null,
  }

  console.log('Top Metrics Data:', data)
  console.log('Engagement Metrics:', engagementTotals)

  return Response.json({
    data: {
      ...totals,
      ...engagementMetrics,
      volume_chart: get_qleadvolume_linechart,
      cost_per_lead_chart: get_qleadcostper_linechart,
    }
  })
}
