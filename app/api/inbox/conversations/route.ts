import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { parsePagination } from '@/lib/utils/pagination';
import { conversationSchema } from '@/schemas/conversation.schema';
import { Conversation, Contact } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const { page, pageSize, offset } = parsePagination(req);
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const channel = url.searchParams.get('channel');
    const where: Record<string, unknown> = { businessId };
    if (status) where['status'] = status;
    if (channel) where['channel'] = channel;
    const result = await Conversation.findAndCountAll({ where, include: [{ model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName', 'email'] }], limit: pageSize, offset, order: [['lastMessageAt', 'DESC']] });
    return ok({ data: result.rows, total: result.count, page, pageSize });
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = getAuthContext(req);
    const parsed = conversationSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const conv = await Conversation.create({ ...parsed.data, businessId });
    return ok(conv, 201);
  } catch { return err('Internal server error', 500); }
}
