import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { integrationSchema } from '@/schemas/config.schema';
import { Integration } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const integrations = await Integration.findAll({ where: { businessId }, order: [['name', 'ASC']] });
    return ok(integrations);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = integrationSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const integration = await Integration.create({ ...parsed.data, businessId });
    return ok(integration, 201);
  } catch { return err('Internal server error', 500); }
}
