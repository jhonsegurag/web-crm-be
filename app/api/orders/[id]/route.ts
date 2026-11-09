import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { orderSchema } from '@/schemas/order.schema';
import { Order, OrderItem, Product } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({
      where: { id: params.id, businessId },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
    if (!order) return err('Not found', 404);
    return ok(order);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    const parsed = orderSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await order.update(parsed.data);
    return ok(order);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    await order.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
