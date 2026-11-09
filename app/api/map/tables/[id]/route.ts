import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { tableSchema } from '@/schemas/map.schema';
import { Table } from '@/lib/db/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const table = await Table.findByPk(params.id);
    if (!table) return err('Not found', 404);
    const parsed = tableSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await table.update(parsed.data);
    return ok(table);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const table = await Table.findByPk(params.id);
    if (!table) return err('Not found', 404);
    await table.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
