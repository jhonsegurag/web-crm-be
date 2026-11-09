import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { productSchema } from '@/schemas/catalog.schema';
import { Product } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const product = await Product.findOne({ where: { id: params.id, businessId } });
    if (!product) return err('Not found', 404);
    return ok(product);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const product = await Product.findOne({ where: { id: params.id, businessId } });
    if (!product) return err('Not found', 404);
    const parsed = productSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await product.update(parsed.data);
    return ok(product);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const product = await Product.findOne({ where: { id: params.id, businessId } });
    if (!product) return err('Not found', 404);
    await product.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
