import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const groupBy = searchParams.get('groupBy') || 'day' // day/week/month

  const { data, error } = await supabase.rpc('get_cost_line_chart_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
    input_group_by: groupBy,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ data }), { status: 200 })
}
