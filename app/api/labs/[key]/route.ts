import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { FeatureFlag } from '@/lib/db/models';

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const flag = await FeatureFlag.findOne({ where: { businessId, key: params.key } });
    if (!flag) return err('Not found', 404);
    await flag.update({ isEnabled: !flag.isEnabled });
    return ok(flag);
  } catch { return err('Internal server error', 500); }
}
