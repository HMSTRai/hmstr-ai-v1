// api/google-ads-qlead-metrics/route.js
import { supabaseServer } from '@/lib/supabaseClient'; // Use the server-side client

function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    const dateStr = current.toISOString().slice(0, 10);
    if (!dates.includes(dateStr) && new Date(dateStr) <= endDate) {
      dates.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

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

  console.log('API Request: clientId =', clientIdNum, 'start =', formattedStart, 'end =', formattedEnd);

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

  // Combine all payload
  const responsePayload = {
    metrics: {
      ppcQLeads: metrics.ppc_qleads,
      totalSpend: metrics.total_spend,
      cpql: metrics.cpql
    },
    campaignData
  };

  console.log('Final Response Payload:', responsePayload);

  return Response.json({ data: responsePayload });
}