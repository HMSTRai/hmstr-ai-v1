import { supabaseServer } from '@/lib/supabaseClient';

function getDatesInRange(start, end, groupBy = 'day') {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    let dateStr = current.toISOString().slice(0, 10);
    if (groupBy === 'week') {
      const day = current.getDay();
      const daysToSubtract = day === 0 ? 6 : day - 1;
      current.setDate(current.getDate() - daysToSubtract);
      dateStr = current.toISOString().slice(0, 10);
    } else if (groupBy === 'month') {
      current.setDate(1);
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
  const type = searchParams.get('type') || 'metrics';

  const clientIdNum = Number(clientId);
  if (isNaN(clientIdNum)) {
    return Response.json({ error: 'Invalid clientId parameter' }, { status: 400 });
  }

  const startDate = new Date(startParam);
  let endDate = new Date(endParam);
  const today = new Date(); // Current date: July 29, 2025, 11:21 AM PST
  if (endDate > today) {
    endDate = new Date(today.toISOString().slice(0, 10));
    console.log('End date adjusted to today:', endDate.toISOString().slice(0, 10));
  }
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
    return Response.json({ error: 'Invalid date parameters' }, { status: 400 });
  }
  const formattedStart = startDate.toISOString().slice(0, 10);
  const formattedEnd = endDate.toISOString().slice(0, 10);

  console.log('API Request:', { clientId: clientIdNum, start: formattedStart, end: formattedEnd, type });

  let responsePayload = {};

  try {
    if (type === 'metrics') {
      const { data: metricsData, error: metricsError } = await supabaseServer.rpc('googleads_qleads', {
        p_client_id: clientIdNum,
        p_start_date: formattedStart,
        p_end_date: formattedEnd
      });
      console.log('Metrics RPC Result:', JSON.stringify(metricsData, null, 2), 'Error:', metricsError);

      if (metricsError) throw metricsError;
      responsePayload.sourceMetrics = metricsData?.[0] || { ppc_qleads: 0, total_spend: 0, cpql: 0 };
    } else if (type === 'bycampaign') {
      const { data: campaignsData, error: campaignsError } = await supabaseServer.rpc('googleads_qleads_bycampaign', {
        p_client_id: clientIdNum,
        p_start_date: formattedStart,
        p_end_date: formattedEnd
      });
      console.log('Campaigns RPC Result:', JSON.stringify(campaignsData, null, 2), 'Error:', campaignsError);

      if (campaignsError) throw campaignsError;
      responsePayload.campaigns = campaignsData || [];
    } else {
      return Response.json({ error: 'Invalid type parameter. Use "metrics" or "bycampaign"' }, { status: 400 });
    }
  } catch (error) {
    console.error('RPC Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  console.log('Final Response Payload:', responsePayload);
  return Response.json({ data: responsePayload });
}