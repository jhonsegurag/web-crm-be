import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { roomSchema } from '@/schemas/map.schema';
import { Floor, Room } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const rooms = await Room.findAll({ where: { floorId: params.id }, order: [['createdAt', 'ASC']] });
    return ok(rooms);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const parsed = roomSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const room = await Room.create({ ...parsed.data, floorId: params.id });
    return ok(room, 201);
  } catch { return err('Internal server error', 500); }
}
