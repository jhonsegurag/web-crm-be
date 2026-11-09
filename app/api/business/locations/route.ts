import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { locationSchema } from '@/schemas/business.schema';
import { Location } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const locations = await Location.findAll({ where: { businessId }, order: [['createdAt', 'ASC']] });
    return ok(locations);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = locationSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const location = await Location.create({ ...parsed.data, businessId });
    return ok(location, 201);
  } catch { return err('Internal server error', 500); }
}
