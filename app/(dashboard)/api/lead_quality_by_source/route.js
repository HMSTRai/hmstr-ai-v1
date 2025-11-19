import { supabaseServer } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const grouping = searchParams.get('grouping') || 'month'

  const clientIdNum = Number(clientId)
  if (isNaN(clientIdNum)) return Response.json({ error: 'Invalid clientId' }, { status: 400 })

  const startDate = new Date(start).toISOString().slice(0, 10)
  const endDate = new Date(end).toISOString().slice(0, 10)

  try {
    const [
      { data: cards },
      { data: intake },
      { data: percent },
      { data: leadScore },
      { data: closeScore },
    ] = await Promise.all([
      supabaseServer.rpc('qlead_quality_source', {
        input_client_id: clientIdNum,
        input_start_date: startDate,
        input_end_date: endDate,
      }),
      supabaseServer.rpc('qlead_intakescore_source_linechart', {
        input_client_id: clientIdNum,
        input_start_date: startDate,
        input_end_date: endDate,
        input_grouping: grouping,
      }),
      supabaseServer.rpc('qlead_per_source_linechart', {
        input_client_id: clientIdNum,
        input_start_date: startDate,
        input_end_date: endDate,
        input_grouping: grouping,
      }),
      supabaseServer.rpc('qlead_leadscore_source_linechart', {
        input_client_id: clientIdNum,
        input_start_date: startDate,
        input_end_date: endDate,
        input_grouping: grouping,
      }),
      supabaseServer.rpc('qlead_closescore_source_linechart', {
        input_client_id: clientIdNum,
        input_start_date: startDate,
        input_end_date: endDate,
        input_grouping: grouping,
      }),
    ])

    const sourceCardsData = Array.isArray(cards) && cards.length > 0 ? cards[0] : {}

    return Response.json({
      data: {
        sourceCards: sourceCardsData,
        intakeScore: intake ?? [],
        percentQualified: percent ?? [],
        leadScore: leadScore ?? [],
        closeScore: closeScore ?? [],
      },
    })
  } catch (e) {
    console.error('RPC Error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}