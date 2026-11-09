import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { orderItemSchema } from '@/schemas/order.schema';
import { Order, OrderItem } from '@/lib/db/models';

export async function PATCH(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    const item = await OrderItem.findOne({ where: { id: params.itemId, orderId: params.id } });
    if (!item) return err('Not found', 404);
    const parsed = orderItemSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const quantity = parsed.data.quantity ?? item.quantity;
    const subtotal = Number(item.price) * quantity;
    await item.update({ quantity, subtotal, notes: parsed.data.notes ?? item.notes });
    const allItems = await OrderItem.findAll({ where: { orderId: params.id } });
    const newSubtotal = allItems.reduce((sum, i) => sum + Number(i.subtotal), 0);
    await order.update({ subtotal: newSubtotal, total: newSubtotal });
    return ok(item);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    const item = await OrderItem.findOne({ where: { id: params.itemId, orderId: params.id } });
    if (!item) return err('Not found', 404);
    await item.destroy();
    const allItems = await OrderItem.findAll({ where: { orderId: params.id } });
    const newSubtotal = allItems.reduce((sum, i) => sum + Number(i.subtotal), 0);
    await order.update({ subtotal: newSubtotal, total: newSubtotal });
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
