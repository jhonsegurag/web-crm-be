import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { locationSchema } from '@/schemas/business.schema';
import { Location } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const loc = await Location.findOne({ where: { id: params.id, businessId } });
    if (!loc) return err('Not found', 404);
    return ok(loc);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const loc = await Location.findOne({ where: { id: params.id, businessId } });
    if (!loc) return err('Not found', 404);
    const parsed = locationSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await loc.update(parsed.data);
    return ok(loc);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const loc = await Location.findOne({ where: { id: params.id, businessId } });
    if (!loc) return err('Not found', 404);
    await loc.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
