import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { roleSchema } from '@/schemas/config.schema';
import { Role } from '@/lib/db/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const role = await Role.findByPk(params.id);
    if (!role) return err('Not found', 404);
    const parsed = roleSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await role.update(parsed.data);
    return ok(role);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const role = await Role.findByPk(params.id);
    if (!role) return err('Not found', 404);
    await role.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
