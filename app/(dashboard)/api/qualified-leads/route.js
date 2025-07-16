import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const groupBy = searchParams.get('groupBy') || 'day' // default to 'day'

  if (!clientId || !start || !end) {
    return new Response(JSON.stringify({ error: 'Missing required query params' }), { status: 400 })
  }

  try {
    // Call the new RPC with parameters
    const { data, error } = await supabase.rpc('get_qualified_leads_line_chart_r', {
      input_client_id: clientId,
      input_start_date: start,
      input_end_date: end,
      input_group_by: groupBy,
    })

    if (error) {
      console.error('RPC Error:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    // Transform the returned data for frontend usage
    // Map to your frontend chart data keys
    const leads_chart = (data || []).map(row => ({
      date: row.group_date,
      total: row.qualified_leads,
      ppc: row.qualified_leads_ppc,
      lsa: row.qualified_leads_lsa,
      seo: row.qualified_leads_seo,
    }))

    return new Response(JSON.stringify({ data: { leads_chart } }), { status: 200 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Unexpected error occurred' }), { status: 500 })
  }
}
