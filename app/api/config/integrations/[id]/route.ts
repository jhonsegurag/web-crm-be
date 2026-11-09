import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { integrationSchema } from '@/schemas/config.schema';
import { Integration } from '@/lib/db/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const integration = await Integration.findOne({ where: { id: params.id, businessId } });
    if (!integration) return err('Not found', 404);
    const parsed = integrationSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await integration.update(parsed.data);
    return ok(integration);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const integration = await Integration.findOne({ where: { id: params.id, businessId } });
    if (!integration) return err('Not found', 404);
    await integration.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
