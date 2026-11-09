import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { User } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuthContext(req);
    const user = await User.findByPk(userId, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return err('User not found', 404);
    return ok(user);
  } catch { return err('Internal server error', 500); }
}
