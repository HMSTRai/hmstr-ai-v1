// api/top-metrics/route.js
import { supabaseServer } from '@/lib/supabaseClient'; // Use the server-side client

function getDatesInRange(start, end, groupBy = 'day') {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    let dateStr = current.toISOString().slice(0, 10);
    if (groupBy === 'week') {
      // Set to the start of the week (e.g., Sunday)
      const day = current.getDay();
      current.setDate(current.getDate() - day);
      dateStr = current.toISOString().slice(0, 10);
    } else if (groupBy === 'month') {
      current.setDate(1); // Set to the first of the month
      dateStr = current.toISOString().slice(0, 10);
    }
    if (!dates.includes(dateStr) && new Date(dateStr) <= endDate) {
      dates.push(dateStr);
    }
    if (groupBy === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (groupBy === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }
  return dates;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const groupBy = searchParams.get('groupBy') || 'day'; // Default to 'day' if not provided

  const clientIdNum = Number(clientId);
  if (isNaN(clientIdNum)) {
    return Response.json({ error: 'Invalid clientId parameter' }, { status: 400 });
  }

  // Parse and format dates to YYYY-MM-DD
  const startDate = new Date(startParam);
  const endDate = new Date(endParam);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return Response.json({ error: 'Invalid date parameters' }, { status: 400 });
  }
  const formattedStart = startDate.toISOString().slice(0, 10);
  const formattedEnd = endDate.toISOString().slice(0, 10);

  console.log('API Request: clientId =', clientIdNum, 'start =', formattedStart, 'end =', formattedEnd, 'groupBy =', groupBy);

  // 1. Top metrics
  const { data: topData, error: topError } = await supabaseServer.rpc('get_qlead_data', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd
  });

  if (topError) return Response.json({ error: topError.message }, { status: 500 });
  const topMetrics = topData?.[0] ?? {};

  // 1b. Source top metrics
  const { data: sourceTopData, error: sourceTopError } = await supabaseServer.rpc('get_qlead_data_source', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd
  });

  if (sourceTopError) return Response.json({ error: sourceTopError.message }, { status: 500 });
  const sourceMetrics = sourceTopData?.[0] ?? {};

  // 2. Call engagement metrics
  const { data: engagementData, error: engagementError } = await supabaseServer.rpc('get_call_engagement_metrics', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd
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

  // 3. Chart data with dynamic groupBy
  const { data: volumeData, error: volumeError } = await supabaseServer.rpc('get_qleadvolume_linechart', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: groupBy
  });
  console.log('Volume RPC Result:', volumeData, 'Error:', volumeError);

  const { data: costData, error: costError } = await supabaseServer.rpc('get_qleadcostper_linechart', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: groupBy
  });
  console.log('Cost RPC Result:', costData, 'Error:', costError);

  const { data: costLineData, error: costLineError } = await supabaseServer.rpc('get_cost_line_chart_metrics', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: groupBy
  });
  console.log('Cost Line RPC Result:', costLineData, 'Error:', costLineError);

  const { data: cpqlLineData, error: cpqlLineError } = await supabaseServer.rpc('get_cpql_line_chart_metrics', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: groupBy
  });
  console.log('CPQL Line RPC Result:', cpqlLineData, 'Error:', cpqlLineError);

  if (volumeError) console.error('Volume chart error:', volumeError.message);
  if (costError) console.error('Cost chart error:', costError.message);
  if (costLineError) console.error('Cost line chart error:', costLineError.message);
  if (cpqlLineError) console.error('CPQL line chart error:', cpqlLineError.message);

  // 4. Normalize chart rows by date based on groupBy
  const dates = getDatesInRange(formattedStart, formattedEnd, groupBy);

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

  const cost_chart = dates.map(date => {
    const row = (costLineData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      total: row?.spend_total ?? 0,
      ppc: row?.spend_ppc ?? 0,
      lsa: row?.spend_lsa ?? 0,
      seo: row?.spend_seo ?? 0
    };
  });

  const cpql_chart = dates.map(date => {
    const row = (cpqlLineData ?? []).find(r => r.group_date?.slice(0, 10) === date);
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
    topMetrics,
    sourceMetrics,
    engagementMetrics,
    volume_chart,
    cost_per_lead_chart,
    cost_chart,
    cpql_chart
  };

  console.log('Final Response Payload:', responsePayload);

  return Response.json({ data: responsePayload });
}