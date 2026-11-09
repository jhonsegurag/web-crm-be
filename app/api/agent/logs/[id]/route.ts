import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { AgentLog } from '@/lib/db/models';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const log = await AgentLog.findByPk(params.id);
    if (!log) return err('Not found', 404);
    await log.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
