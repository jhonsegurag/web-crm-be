import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { userConfigSchema } from '@/schemas/config.schema';
import { User } from '@/lib/db/models';
import { hashPassword } from '@/lib/auth/password';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const user = await User.findOne({ where: { id: params.id, businessId }, attributes: { exclude: ['passwordHash'] } });
    if (!user) return err('Not found', 404);
    return ok(user);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const user = await User.findOne({ where: { id: params.id, businessId } });
    if (!user) return err('Not found', 404);
    const parsed = userConfigSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const { password, ...rest } = parsed.data;
    const updates: Partial<Pick<typeof user, 'email' | 'roleId' | 'isActive' | 'passwordHash'>> = { ...rest };
    if (password) updates.passwordHash = await hashPassword(password);
    await user.update(updates);
    const { passwordHash: _ph, ...safeUser } = user.toJSON();
    return ok(safeUser);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const user = await User.findOne({ where: { id: params.id, businessId } });
    if (!user) return err('Not found', 404);
    await user.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
