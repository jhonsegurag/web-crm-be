import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { Integration } from '@/lib/db/models';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const integration = await Integration.findOne({ where: { id: params.id, businessId } });
    if (!integration) return err('Not found', 404);
    await integration.update({ isActive: !integration.isActive });
    return ok(integration);
  } catch { return err('Internal server error', 500); }
}
