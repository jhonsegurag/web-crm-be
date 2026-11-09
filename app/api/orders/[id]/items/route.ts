import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { orderItemSchema } from '@/schemas/order.schema';
import { Order, OrderItem, Product } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    const items = await OrderItem.findAll({ where: { orderId: params.id }, include: [{ model: Product, as: 'product' }] });
    return ok(items);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const order = await Order.findOne({ where: { id: params.id, businessId } });
    if (!order) return err('Not found', 404);
    const parsed = orderItemSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const product = await Product.findOne({ where: { id: parsed.data.productId, businessId } });
    if (!product) return err('Product not found', 404);
    const subtotal = Number(product.price) * parsed.data.quantity;
    const item = await OrderItem.create({
      orderId: params.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: parsed.data.quantity,
      subtotal,
      notes: parsed.data.notes,
    });
    const allItems = await OrderItem.findAll({ where: { orderId: params.id } });
    const newSubtotal = allItems.reduce((sum, i) => sum + Number(i.subtotal), 0);
    await order.update({ subtotal: newSubtotal, total: newSubtotal });
    return ok(item, 201);
  } catch { return err('Internal server error', 500); }
}
