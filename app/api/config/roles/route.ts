import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { roleSchema } from '@/schemas/config.schema';
import { Role } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const roles = await Role.findAll({ order: [['name', 'ASC']] });
    return ok(roles);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = roleSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const existing = await Role.findOne({ where: { name: parsed.data.name } });
    if (existing) return err('Role already exists', 409);
    const role = await Role.create(parsed.data);
    return ok(role, 201);
  } catch { return err('Internal server error', 500); }
}
