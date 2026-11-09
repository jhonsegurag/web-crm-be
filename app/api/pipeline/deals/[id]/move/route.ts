import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { moveDealSchema } from '@/schemas/pipeline.schema';
import { Deal, PipelineStage } from '@/lib/db/models';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const deal = await Deal.findOne({ where: { id: params.id, businessId } });
    if (!deal) return err('Deal not found', 404);
    const parsed = moveDealSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const stage = await PipelineStage.findOne({ where: { id: parsed.data.stageId, businessId } });
    if (!stage) return err('Stage not found', 404);
    await deal.update({ stageId: parsed.data.stageId, position: parsed.data.position });
    return ok(deal);
  } catch { return err('Internal server error', 500); }
}
