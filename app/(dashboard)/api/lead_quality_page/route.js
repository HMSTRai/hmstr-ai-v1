import { supabaseServer } from '@/lib/supabaseClient'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const clientIdNum = Number(clientId)
  if (isNaN(clientIdNum)) return Response.json({ error: 'Invalid clientId' }, { status: 400 })

  const startDate = new Date(start).toISOString().slice(0, 10)
  const endDate = new Date(end).toISOString().slice(0, 10)

  try {
    const { data: cards, error: e1 } = await supabaseServer.rpc('qlead_quality_source', {
      input_client_id: clientIdNum,
      input_start_date: startDate,
      input_end_date: endDate,
    })

    const { data: intake, error: e2 } = await supabaseServer.rpc('qlead_intakescore_source_linechart', {
      input_client_id: clientIdNum,
      input_start_date: startDate,
      input_end_date: endDate,
    })

    const { data: percent, error: e3 } = await supabaseServer.rpc('qlead_per_source_linechart', {
      input_client_id: clientIdNum,
      input_start_date: startDate,
      input_end_date: endDate,
    })

    const { data: leadScore, error: e4 } = await supabaseServer.rpc('qlead_leadscore_source_linechart', {
      input_client_id: clientIdNum,
      input_start_date: startDate,
      input_end_date: endDate,
    })

    const { data: closeScore, error: e5 } = await supabaseServer.rpc('qlead_closescore_source_linechart', {
      input_client_id: clientIdNum,
      input_start_date: startDate,
      input_end_date: endDate,
    })

    if (e1 || e2 || e3 || e4 || e5) {
      const msg = e1?.message || e2?.message || e3?.message || e4?.message || e5?.message
      return Response.json({ error: msg }, { status: 500 })
    }

    return Response.json({
      data: {
        sourceCards: cards ?? [],
        intakeScore: intake ?? [],
        percentQualified: percent ?? [],
        leadScore: leadScore ?? [],
        closeScore: closeScore ?? [],
      },
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}