import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { FeatureFlag } from '@/lib/db/models';
import { Op, literal } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const flags = await FeatureFlag.findAll({
      where: {
        [Op.or]: [{ businessId }, { businessId: { [Op.is]: literal('NULL') } }],
      },
      order: [['key', 'ASC']],
    });
    return ok(flags);
  } catch { return err('Internal server error', 500); }
}
