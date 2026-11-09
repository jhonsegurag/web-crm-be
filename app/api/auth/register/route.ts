import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { registerSchema } from '@/schemas/auth.schema';
import { User, Business, Role } from '@/lib/db/models';
import { hashPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { sequelize } from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  const t = await sequelize.transaction();
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const existing = await User.findOne({ where: { email: parsed.data.email } });
    if (existing) { await t.rollback(); return err('Email already registered', 409); }
    const slug = `${parsed.data.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;
    const business = await Business.create({ name: parsed.data.businessName, slug }, { transaction: t });
    let adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) adminRole = await Role.create({ name: 'admin', permissions: ['*'] }, { transaction: t });
    const user = await User.create({ email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password), businessId: business.id, roleId: adminRole.id, isActive: true }, { transaction: t });
    await t.commit();
    const token = await signToken({ sub: user.id, email: user.email, businessId: business.id, roleId: adminRole.id });
    return ok({ token, user: { id: user.id, email: user.email, businessId: business.id } }, 201);
  } catch { await t.rollback(); return err('Internal server error', 500); }
}
