import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { floorSchema } from '@/schemas/map.schema';
import { Floor } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const floors = await Floor.findAll({ where: { businessId }, order: [['level', 'ASC']] });
    return ok(floors);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = floorSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const floor = await Floor.create({ ...parsed.data, businessId });
    return ok(floor, 201);
  } catch { return err('Internal server error', 500); }
}
