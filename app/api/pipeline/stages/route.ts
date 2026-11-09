import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { stageSchema } from '@/schemas/pipeline.schema';
import { PipelineStage } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const stages = await PipelineStage.findAll({ where: { businessId }, order: [['position', 'ASC']] });
    return ok(stages);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = stageSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const stage = await PipelineStage.create({ ...parsed.data, businessId });
    return ok(stage, 201);
  } catch { return err('Internal server error', 500); }
}
