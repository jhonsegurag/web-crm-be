import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { orderSchema } from '@/schemas/order.schema';
import { Order } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const contactId = url.searchParams.get('contactId');
    const where: Record<string, unknown> = { businessId };
    if (status) where['status'] = status;
    if (contactId) where['contactId'] = contactId;
    const result = await Order.findAndCountAll({ where, limit: pageSize, offset, order: [['createdAt', 'DESC']] });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = orderSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const code = `ORD-${Date.now().toString().slice(-6)}`;
    const order = await Order.create({ ...parsed.data, businessId, code, subtotal: 0, discount: 0, tax: 0, total: 0 });
    return ok(order, 201);
  } catch { return err('Internal server error', 500); }
}
