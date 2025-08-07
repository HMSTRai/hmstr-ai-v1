import { supabaseServer } from '@/lib/supabaseClient';
import { createClerkClient } from '@clerk/backend';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req) {
  const auth = getAuth(req);
  if (!auth.userId) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const user = await clerk.users.getUser(auth.userId);
  const isAdmin = user.publicMetadata.is_admin ?? false;

  let userClientIds = [];
  if (auth.orgId) {
    const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });
    const metadata = org.publicMetadata || {};
    userClientIds = metadata.client_ids ? metadata.client_ids.map(Number) : (metadata.client_id ? [Number(metadata.client_id)] : []);
  }

  let data;
  let error;

  if (isAdmin) {
    ({ data, error } = await supabaseServer
      .from('clients_ffs')
      .select('client_id, cr_company_name')
      .order('cr_company_name', { ascending: true }));
  } else {
    if (userClientIds.length === 0) {
      return Response.json({ data: [] });
    }
    ({ data, error } = await supabaseServer
      .from('clients_ffs')
      .select('client_id, cr_company_name')
      .in('client_id', userClientIds)
      .order('cr_company_name', { ascending: true }));
  }

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data: data || [] });
}