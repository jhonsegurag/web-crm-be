import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { Message } from '@/lib/db/models';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const msg = await Message.findByPk(params.id);
    if (!msg) return err('Not found', 404);
    await msg.update({ isRead: true });
    return ok(msg);
  } catch { return err('Internal server error', 500); }
}
