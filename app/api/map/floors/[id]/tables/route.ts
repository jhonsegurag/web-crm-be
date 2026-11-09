import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { tableSchema } from '@/schemas/map.schema';
import { Floor, Table } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const tables = await Table.findAll({ where: { floorId: params.id }, order: [['label', 'ASC']] });
    return ok(tables);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const floor = await Floor.findOne({ where: { id: params.id, businessId } });
    if (!floor) return err('Not found', 404);
    const parsed = tableSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const table = await Table.create({ ...parsed.data, floorId: params.id });
    return ok(table, 201);
  } catch { return err('Internal server error', 500); }
}
