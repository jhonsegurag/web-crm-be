import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { dealSchema } from '@/schemas/pipeline.schema';
import { Deal } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const deal = await Deal.findOne({ where: { id: params.id, businessId } });
    if (!deal) return err('Deal not found', 404);
    return ok(deal);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const deal = await Deal.findOne({ where: { id: params.id, businessId } });
    if (!deal) return err('Deal not found', 404);
    const parsed = dealSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await deal.update(parsed.data);
    return ok(deal);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const deal = await Deal.findOne({ where: { id: params.id, businessId } });
    if (!deal) return err('Deal not found', 404);
    await deal.destroy();
    return ok(null, 204);
  } catch { return err('Internal server error', 500); }
}
