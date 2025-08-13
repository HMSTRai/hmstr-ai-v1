// api/google-ads-qlead-metrics/route.js
import { supabaseServer } from '@/lib/supabaseClient'; // Use the server-side client

function getDatesInRange(start, end, groupBy = 'day') {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    let dateStr = current.toISOString().slice(0, 10);
    if (groupBy === 'week') {
      // Set to the start of the week (Monday to match PostgreSQL date_trunc('week'))
      const day = current.getDay();
      const daysToSubtract = day === 0 ? 6 : day - 1;
      current.setDate(current.getDate() - daysToSubtract);
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
  const volumePeriod = searchParams.get('volumePeriod') || 'month';
  const costPeriod = searchParams.get('costPeriod') || 'month';

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

  console.log('API Request: clientId =', clientIdNum, 'start =', formattedStart, 'end =', formattedEnd, 'volumePeriod =', volumePeriod, 'costPeriod =', costPeriod);

  // Fetch Google Ads QLead Metrics
  const { data: qleadMetrics, error: qleadError } = await supabaseServer.rpc('googleads_qleads', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd
  });

  if (qleadError) return Response.json({ error: qleadError.message }, { status: 500 });
  const metrics = qleadMetrics?.[0] ?? { ppc_qleads: 0, total_spend: 0, cpql: 0 };

  // Fetch Google Ads QLead Metrics by Campaign
  const { data: qleadCampaignData, error: qleadCampaignError } = await supabaseServer.rpc('googleads_qleads_bycampaign', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd
  });

  if (qleadCampaignError) console.error('Campaign metrics error:', qleadCampaignError.message);

  const campaignData = qleadCampaignData ?? [];

  // Fetch PPC QLeads Volume & Cost Chart Data
  const { data: volumeCostData, error: vcError } = await supabaseServer.rpc('get_ppc_qleadvolumecost_linebarchart', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: volumePeriod
  });

  if (vcError) console.error('Volume Cost Chart error:', vcError.message);

  // Fetch Cost Per QLead Chart Data
  const { data: costPerData, error: cpError } = await supabaseServer.rpc('get_ppc_qleadcostper_linechart', {
    input_client_id: clientIdNum,
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: costPeriod
  });

  if (cpError) console.error('Cost Per Chart error:', cpError.message);

  const chartDatesVolume = getDatesInRange(formattedStart, formattedEnd, volumePeriod);
  const chartDatesCost = getDatesInRange(formattedStart, formattedEnd, costPeriod);

  const volumeCost = chartDatesVolume.map(date => {
    const row = (volumeCostData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      period: date,
      qleads: row?.qualified_leads_ppc ?? 0,
      spend: row?.spend_ppc ?? 0
    };
  });

  const costPer = chartDatesCost.map(date => {
    const row = (costPerData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      period: date,
      cpql: row?.cpql_ppc ?? 0
    };
  });

  // Combine all payload
  const responsePayload = {
    metrics: {
      ppcQLeads: metrics.ppc_qleads,
      totalSpend: metrics.total_spend,
      cpql: metrics.cpql
    },
    campaignData,
    chartData: {
      volumeCost,
      costPer
    }
  };

  console.log('Final Response Payload:', responsePayload);

  return Response.json({ data: responsePayload });
}