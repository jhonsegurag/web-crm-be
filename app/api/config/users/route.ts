import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { userConfigSchema } from '@/schemas/config.schema';
import { User, Role } from '@/lib/db/models';
import { hashPassword } from '@/lib/auth/password';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const result = await User.findAndCountAll({
      where: { businessId },
      attributes: { exclude: ['passwordHash'] },
      include: [{ model: Role, as: 'role' }],
      limit: pageSize, offset, order: [['createdAt', 'ASC']],
    });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = userConfigSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const existing = await User.findOne({ where: { email: parsed.data.email } });
    if (existing) return err('Email already registered', 409);
    const passwordHash = await hashPassword(parsed.data.password ?? 'changeme123');
    const user = await User.create({
      email: parsed.data.email, passwordHash,
      roleId: parsed.data.roleId, businessId,
      isActive: parsed.data.isActive ?? true,
    });
    const { passwordHash: _ph, ...safeUser } = user.toJSON();
    return ok(safeUser, 201);
  } catch { return err('Internal server error', 500); }
}
