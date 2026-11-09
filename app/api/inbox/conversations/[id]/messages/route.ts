import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { messageSchema } from '@/schemas/conversation.schema';
import { Conversation, Message } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const conv = await Conversation.findOne({ where: { id: params.id, businessId } });
    if (!conv) return err('Not found', 404);
    const result = await Message.findAndCountAll({ where: { conversationId: params.id }, limit: pageSize, offset, order: [['createdAt', 'ASC']] });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const conv = await Conversation.findOne({ where: { id: params.id, businessId } });
    if (!conv) return err('Not found', 404);
    const parsed = messageSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const msg = await Message.create({ ...parsed.data, conversationId: params.id });
    await conv.update({ lastMessageAt: new Date() });
    return ok(msg, 201);
  } catch { return err('Internal server error', 500); }
}
