import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { roomSchema } from '@/schemas/map.schema';
import { Floor, Room } from '@/lib/db/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string; roomId: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const room = await Room.findOne({ where: { id: params.roomId, floorId: params.id } });
    if (!room) return err('Not found', 404);
    const parsed = roomSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await room.update(parsed.data);
    return ok(room);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; roomId: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const room = await Room.findOne({ where: { id: params.roomId, floorId: params.id } });
    if (!room) return err('Not found', 404);
    await room.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
