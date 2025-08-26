import { supabaseServer } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('clients_ffs')
    .select('client_id, cr_company_name')
    .eq('client_active', true)
    .order('cr_company_name', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}