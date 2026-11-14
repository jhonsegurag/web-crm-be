import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { waitlistJoinSchema } from '@/schemas/waitlist.schema';
import { Waitlist } from '@/lib/db/models';
import { sequelize } from '@/lib/db/connection';

const WAITLIST_CAP = 1000;

export async function GET(req: NextRequest) {
  try {
    getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const result = await Waitlist.findAndCountAll({
      limit: pageSize,
      offset,
      order: [['position', 'ASC']],
    });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch {
    return err('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const t = await sequelize.transaction();
  try {
    const parsed = waitlistJoinSchema.safeParse(await req.json());
    if (!parsed.success) {
      await t.rollback();
      return err(parsed.error.issues[0].message, 422);
    }

    const count = await Waitlist.count({ transaction: t });
    if (count >= WAITLIST_CAP) {
      await t.rollback();
      return err('Waitlist is full', 409);
    }

    const entry = await Waitlist.create(
      { ...parsed.data, position: count + 1 },
      { transaction: t }
    );
    await t.commit();
    return ok({ position: entry.position, email: entry.email }, 201);
  } catch (e: unknown) {
    await t.rollback();
    if (
      e !== null &&
      typeof e === 'object' &&
      'name' in e &&
      (e as { name: string }).name === 'SequelizeUniqueConstraintError'
    ) {
      return err('Email already registered', 409);
    }
    return err('Internal server error', 500);
  }
}
