import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { businessSchema } from '@/schemas/business.schema';
import { Business } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const business = await Business.findByPk(businessId);
    if (!business) return err('Not found', 404);
    return ok(business);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const business = await Business.findByPk(businessId);
    if (!business) return err('Not found', 404);
    const parsed = businessSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await business.update(parsed.data);
    return ok(business);
  } catch { return err('Internal server error', 500); }
}
