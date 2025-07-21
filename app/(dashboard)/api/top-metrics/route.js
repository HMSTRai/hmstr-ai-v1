import { supabaseServer } from '@/lib/supabaseClient'; // Use the server-side client

function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const clientIdNum = Number(clientId);
  if (isNaN(clientIdNum)) {
    return Response.json({ error: 'Invalid clientId parameter' }, { status: 400 });
  }

  console.log('API Request: clientId =', clientIdNum, 'start =', start, 'end =', end);

  // 1. Top metrics
  const { data: topData, error: topError } = await supabaseServer.rpc('get_qlead_data', {
    input_client_id: clientIdNum,
    input_start_date: start,
    input_end_date: end
  });

  if (topError) return Response.json({ error: topError.message }, { status: 500 });
  const totals = topData?.[0] ?? {};

  // 2. Call engagement metrics
  const { data: engagementData, error: engagementError } = await supabaseServer.rpc('get_call_engagement_metrics', {
    input_client_id: clientIdNum,
    input_start_date: start,
    input_end_date: end
  });
  console.log('Engagement RPC Result:', engagementData, 'Error:', engagementError);
  if (engagementError) {
    console.error('Engagement metrics error:', engagementError.message);
  }

  const engagementTotals = engagementData?.[0] ?? {};
  const engagementMetrics = {
    human_engagement_rate: engagementTotals.her_percent ?? null,
    ai_forward_rate: engagementTotals.aifr_percent ?? null,
    human_engaged_count: engagementTotals.human_engaged_true ?? null,
    human_total_count: engagementTotals.total_engagements ?? null,
    ai_forward_count: engagementTotals.ai_forwarded ?? null,
    ai_total_count: engagementTotals.total_forwarded ?? null
  };

  // 3. Chart data
  const { data: volumeData, error: volumeError } = await supabaseServer.rpc('get_qleadvolume_linechart', {
    input_client_id: clientIdNum,
    input_start_date: start,
    input_end_date: end
  });

  const { data: costData, error: costError } = await supabaseServer.rpc('get_qleadcostper_linechart', {
    input_client_id: clientIdNum,
    input_start_date: start,
    input_end_date: end
  });

  if (volumeError) console.error('Volume chart error:', volumeError.message);
  if (costError) console.error('Cost chart error:', costError.message);

  // 4. Normalize chart rows by date
  const dates = getDatesInRange(start, end);

  const volume_chart = dates.map(date => {
    const row = (volumeData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      total: row?.qualified_leads ?? 0,
      ppc: row?.qualified_leads_ppc ?? 0,
      lsa: row?.qualified_leads_lsa ?? 0,
      seo: row?.qualified_leads_seo ?? 0
    };
  });

  const cost_per_lead_chart = dates.map(date => {
    const row = (costData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      total: row?.cpql_all ?? 0,
      ppc: row?.cpql_ppc ?? 0,
      lsa: row?.cpql_lsa ?? 0,
      seo: row?.cpql_seo ?? 0
    };
  });

  // 5. Combine all payload
  const responsePayload = {
    ...totals,
    ...engagementMetrics,
    volume_chart,
    cost_per_lead_chart
  };

  console.log('Final Response Payload:', responsePayload);

  return Response.json({ data: responsePayload });
}