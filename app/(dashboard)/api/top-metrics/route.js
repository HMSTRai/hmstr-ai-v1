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

  // Simulate period chart data until Cory provides it from SQL
  const leads_chart = [
    { date: '2024-12-01', total: 180, ppc: 70, lsa: 45, seo: 65 },
    { date: '2024-12-03', total: 260, ppc: 90, lsa: 80, seo: 90 },
    { date: '2024-12-05', total: data[0]?.qualified_leads ?? 320, ppc: data[0]?.qualified_leads_ppc ?? 120, lsa: data[0]?.qualified_leads_lsa ?? 90, seo: data[0]?.qualified_leads_seo ?? 110 },
    { date: '2024-12-09', total: 430, ppc: 150, lsa: 130, seo: 150 },
    { date: '2024-12-12', total: 350, ppc: 110, lsa: 100, seo: 140 },
  ]
  const cpql_chart = [
    { date: '2024-12-01', total: 150, ppc: 80, lsa: 32, seo: 38 },
    { date: '2024-12-03', total: 170, ppc: 99, lsa: 35, seo: 36 },
    { date: '2024-12-05', total: data[0]?.cpql_total ?? 150, ppc: 70, lsa: 42, seo: 38 },
    { date: '2024-12-09', total: 210, ppc: 110, lsa: 60, seo: 40 },
    { date: '2024-12-12', total: 180, ppc: 100, lsa: 44, seo: 36 },
  ]
  const merged = { ...(data[0] ?? {}), leads_chart, cpql_chart }
  return Response.json({ data: merged })
}
