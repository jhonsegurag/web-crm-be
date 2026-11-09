import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { conversationSchema } from '@/schemas/conversation.schema';
import { Conversation } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const conv = await Conversation.findOne({ where: { id: params.id, businessId } });
    if (!conv) return err('Not found', 404);
    return ok(conv);
  } catch { return err('Internal server error', 500); }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const conv = await Conversation.findOne({ where: { id: params.id, businessId } });
    if (!conv) return err('Not found', 404);
    const parsed = conversationSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await conv.update(parsed.data);
    return ok(conv);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const conv = await Conversation.findOne({ where: { id: params.id, businessId } });
    if (!conv) return err('Not found', 404);
    await conv.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
