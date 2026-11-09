import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { categorySchema } from '@/schemas/catalog.schema';
import { CatalogCategory } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const categories = await CatalogCategory.findAll({ where: { businessId }, order: [['name', 'ASC']] });
    return ok(categories);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = categorySchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const category = await CatalogCategory.create({ ...parsed.data, businessId });
    return ok(category, 201);
  } catch { return err('Internal server error', 500); }
}
