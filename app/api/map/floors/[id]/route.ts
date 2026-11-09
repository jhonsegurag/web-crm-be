import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { floorSchema } from '@/schemas/map.schema';
import { Floor, Room, Table } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({
      where: { id: params.id, businessId },
      include: [
        { model: Room, as: 'rooms', include: [{ model: Table, as: 'tables' }] },
        { model: Table, as: 'tables' },
      ],
    });
    if (!floor) return err('Not found', 404);
    return ok(floor);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const parsed = floorSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await floor.update(parsed.data);
    return ok(floor);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    await floor.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
