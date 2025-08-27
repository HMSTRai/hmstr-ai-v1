// api/bedbug_composit/route.js
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
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const volumeGroupBy = searchParams.get('volumeGroupBy') || 'day';
  const costPerLeadGroupBy = searchParams.get('costPerLeadGroupBy') || 'day';

  const startDate = new Date(startParam);
  const endDate = new Date(endParam);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return Response.json({ error: 'Invalid date parameters' }, { status: 400 });
  }
  const formattedStart = startDate.toISOString().slice(0, 10);
  const formattedEnd = endDate.toISOString().slice(0, 10);

  console.log('API Request: start =', formattedStart, 'end =', formattedEnd, 'volumeGroupBy =', volumeGroupBy, 'costPerLeadGroupBy =', costPerLeadGroupBy);

  const { data: sourceTopData, error: sourceTopError } = await supabaseServer.rpc('get_qlead_data_source_bedbug', {
    input_start_date: formattedStart,
    input_end_date: formattedEnd
  });

  if (sourceTopError) return Response.json({ error: sourceTopError.message }, { status: 500 });
  const sourceMetrics = sourceTopData?.[0] ?? {};

  const { data: volumeData, error: volumeError } = await supabaseServer.rpc('get_qleadvolume_linechart_bedbug', {
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: volumeGroupBy
  });
  console.log('Volume RPC Result:', volumeData, 'Error:', volumeError);

  const { data: costData, error: costError } = await supabaseServer.rpc('get_qleadcostper_linechart_bedbug', {
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: costPerLeadGroupBy
  });
  console.log('Cost RPC Result:', costData, 'Error:', costError);

  const { data: ppcVolumeData, error: ppcVolumeError } = await supabaseServer.rpc('get_ppc_qleadvolumecost_linebarchart_bedbug', {
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: volumeGroupBy
  });
  console.log('PPC Volume Cost RPC Result:', ppcVolumeData, 'Error:', ppcVolumeError);

  const { data: ppcCostData, error: ppcCostError } = await supabaseServer.rpc('get_ppc_qleadcostper_linechart_bedbug', {
    input_start_date: formattedStart,
    input_end_date: formattedEnd,
    input_group_by: costPerLeadGroupBy
  });
  console.log('PPC Cost Per RPC Result:', ppcCostData, 'Error:', ppcCostError);

  if (volumeError) console.error('Volume chart error:', volumeError.message);
  if (costError) console.error('Cost chart error:', costError.message);
  if (ppcVolumeError) console.error('PPC Volume Cost chart error:', ppcVolumeError.message);
  if (ppcCostError) console.error('PPC Cost Per chart error:', ppcCostError.message);

  const volumeDates = getDatesInRange(formattedStart, formattedEnd, volumeGroupBy);
  const costDates = getDatesInRange(formattedStart, formattedEnd, costPerLeadGroupBy);

  const volume_chart = volumeDates.map(date => {
    const row = (volumeData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      total: row?.qualified_leads ?? 0,
      ppc: row?.qualified_leads_ppc ?? 0,
      lsa: row?.qualified_leads_lsa ?? 0,
      seo: row?.qualified_leads_seo ?? 0
    };
  });

  const cost_per_lead_chart = costDates.map(date => {
    const row = (costData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      total: row?.cpql_all ?? 0,
      ppc: row?.cpql_ppc ?? 0,
      lsa: row?.cpql_lsa ?? 0,
      seo: row?.cpql_seo ?? 0
    };
  });

  const ppc_volume_cost_chart = volumeDates.map(date => {
    const row = (ppcVolumeData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      volume: row?.qualified_leads_ppc ?? 0,
      cost: row?.spend_ppc ?? 0
    };
  });

  const ppc_cost_per_chart = costDates.map(date => {
    const row = (ppcCostData ?? []).find(r => r.group_date?.slice(0, 10) === date);
    return {
      date,
      costper: row?.cpql_ppc ?? 0
    };
  });

  const responsePayload = {
    sourceMetrics,
    volume_chart,
    cost_per_lead_chart,
    ppc_volume_cost_chart,
    ppc_cost_per_chart
  };

  console.log('Final Response Payload:', responsePayload);

  return Response.json({ data: responsePayload });
}