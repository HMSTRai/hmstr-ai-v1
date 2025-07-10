// app/api/top-metrics/route.js
import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const { data, error } = await supabase.rpc('get_top_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ data })
}
