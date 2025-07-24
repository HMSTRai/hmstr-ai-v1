// api/qualified-leads/route.js
import { supabaseServer } from '@/lib/supabaseClient';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  const clientIdNum = Number(clientId);
  if (isNaN(clientIdNum)) {
    return Response.json({ error: 'Invalid clientId parameter' }, { status: 400 });
  }

  const startDate = new Date(startParam);
  const endDate = new Date(endParam);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return Response.json({ error: 'Invalid date parameters' }, { status: 400 });
  }
  const formattedStart = startDate.toISOString().slice(0, 10);
  const formattedEnd = endDate.toISOString().slice(0, 10);

  console.log('API Request: clientId =', clientIdNum, 'start =', formattedStart, 'end =', formattedEnd);

  const { data, error } = await supabaseServer.rpc('get_qualified_leads', {
    p_client_id: clientIdNum,
    p_start_date: formattedStart,
    p_end_date: formattedEnd,
  });

  if (error) {
    console.error('Qualified leads error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  console.log('Fetched Qualified Leads:', data);

  return Response.json({ data });
}