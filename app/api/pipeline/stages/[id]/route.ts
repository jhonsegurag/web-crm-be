import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { stageSchema } from '@/schemas/pipeline.schema';
import { PipelineStage } from '@/lib/db/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const stage = await PipelineStage.findOne({ where: { id: params.id, businessId } });
    if (!stage) return err('Not found', 404);
    const parsed = stageSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await stage.update(parsed.data);
    return ok(stage);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const stage = await PipelineStage.findOne({ where: { id: params.id, businessId } });
    if (!stage) return err('Not found', 404);
    await stage.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
