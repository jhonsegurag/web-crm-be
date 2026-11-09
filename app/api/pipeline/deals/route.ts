import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { dealSchema } from '@/schemas/pipeline.schema';
import { Deal, Contact, PipelineStage } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const url = new URL(req.url);
    const stageId = url.searchParams.get('stageId');
    const where: Record<string, unknown> = { businessId };
    if (stageId) where['stageId'] = stageId;
    const result = await Deal.findAndCountAll({ where, include: [{ model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] }, { model: PipelineStage, as: 'stage' }], limit: pageSize, offset, order: [['position', 'ASC']] });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = dealSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const { expectedCloseDate, ...rest } = parsed.data;
    const deal = await Deal.create({
      ...rest,
      businessId,
      ...(expectedCloseDate ? { expectedCloseDate: new Date(expectedCloseDate) } : {}),
    });
    return ok(deal, 201);
  } catch { return err('Internal server error', 500); }
}
