import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { productSchema } from '@/schemas/catalog.schema';
import { Product } from '@/lib/db/models';
import { Op } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const type = url.searchParams.get('type');
    const categoryId = url.searchParams.get('categoryId');
    const where: Record<string, unknown> = { businessId };
    if (type) where['type'] = type;
    if (categoryId) where['categoryId'] = categoryId;
    if (search) where['name'] = { [Op.like]: `%${search}%` };
    const result = await Product.findAndCountAll({ where, limit: pageSize, offset, order: [['name', 'ASC']] });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const product = await Product.create({ ...parsed.data, businessId });
    return ok(product, 201);
  } catch { return err('Internal server error', 500); }
}
