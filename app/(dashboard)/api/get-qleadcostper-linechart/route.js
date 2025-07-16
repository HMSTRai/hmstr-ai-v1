import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key or anon key if public
)

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const clientId = Number(url.searchParams.get('clientId'))
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    const groupBy = 'day' // or change as needed

    if (!clientId || !start || !end) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 })
    }

    const { data, error } = await supabase.rpc('get_qleadcostper_linechart', {
      input_client_id: clientId,
      input_start_date: start,
      input_end_date: end,
      input_group_by: groupBy,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
