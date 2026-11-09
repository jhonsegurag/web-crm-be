import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { AgentLog, AgentConfig } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const config = await AgentConfig.findOne({ where: { businessId } });
    if (!config) return ok({ data: [], total: 0, page, pageSize });
    const result = await AgentLog.findAndCountAll({
      where: { agentConfigId: config.id },
      limit: pageSize, offset, order: [['createdAt', 'DESC']],
    });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}
