import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { loginSchema } from '@/schemas/auth.schema';
import { User } from '@/lib/db/models';
import { comparePassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const user = await User.findOne({ where: { email: parsed.data.email, isActive: true } });
    if (!user) return err('Invalid credentials', 401);
    const valid = await comparePassword(parsed.data.password, user.passwordHash);
    if (!valid) return err('Invalid credentials', 401);
    const token = await signToken({ sub: user.id, email: user.email, businessId: user.businessId ?? '', roleId: user.roleId ?? '' });
    return ok({ token, user: { id: user.id, email: user.email, businessId: user.businessId } });
  } catch { return err('Internal server error', 500); }
}
