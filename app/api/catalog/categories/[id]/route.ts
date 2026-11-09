import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { categorySchema } from '@/schemas/catalog.schema';
import { CatalogCategory } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const cat = await CatalogCategory.findOne({ where: { id: params.id, businessId } });
    if (!cat) return err('Not found', 404);
    return ok(cat);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const cat = await CatalogCategory.findOne({ where: { id: params.id, businessId } });
    if (!cat) return err('Not found', 404);
    const parsed = categorySchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await cat.update(parsed.data);
    return ok(cat);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const cat = await CatalogCategory.findOne({ where: { id: params.id, businessId } });
    if (!cat) return err('Not found', 404);
    await cat.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
