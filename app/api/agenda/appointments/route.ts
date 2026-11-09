import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { appointmentSchema } from '@/schemas/appointment.schema';
import { Appointment, Contact } from '@/lib/db/models';
import { Op } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const assignedTo = url.searchParams.get('assignedTo');
    const where: Record<string, unknown> = { businessId };
    if (assignedTo) where['assignedTo'] = assignedTo;
    if (from || to) {
      const dateFilter: Record<string, unknown> = {};
      if (from) dateFilter[Op.gte as unknown as string] = new Date(from);
      if (to) dateFilter[Op.lte as unknown as string] = new Date(to);
      where['startsAt'] = dateFilter;
    }
    const result = await Appointment.findAndCountAll({
      where,
      include: [{ model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      limit: pageSize, offset, order: [['startsAt', 'ASC']],
    });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = appointmentSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const appointment = await Appointment.create({ ...parsed.data, businessId });
    return ok(appointment, 201);
  } catch { return err('Internal server error', 500); }
}
