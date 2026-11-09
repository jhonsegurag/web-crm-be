import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { agentConfigSchema } from '@/schemas/agent.schema';
import { AgentConfig } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const [config] = await AgentConfig.findOrCreate({
      where: { businessId },
      defaults: { businessId, name: 'Default Agent', provider: 'openai', temperature: 0.7, maxTokens: 1024, isActive: true },
    });
    return ok(config);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = agentConfigSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const [config] = await AgentConfig.findOrCreate({
      where: { businessId },
      defaults: { businessId, name: 'Default Agent', provider: 'openai', temperature: 0.7, maxTokens: 1024, isActive: true },
    });
    await config.update(parsed.data);
    return ok(config);
  } catch { return err('Internal server error', 500); }
}
