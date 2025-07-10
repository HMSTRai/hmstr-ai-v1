// app/api/clients/route.js
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabase
    .from('clients_ffs')
    .select('cr_client_id, cr_company_name')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ data })
}
