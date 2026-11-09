import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { Contact, ContactNote } from '@/lib/db/models';
import { z } from 'zod';

const noteSchema = z.object({ content: z.string().min(1) });

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const contact = await Contact.findOne({ where: { id: params.id, businessId } });
    if (!contact) return err('Not found', 404);
    const notes = await ContactNote.findAll({ where: { contactId: params.id }, order: [['createdAt', 'DESC']] });
    return ok(notes);
  } catch { return err('Internal server error', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId, userId } = getAuthContext(req);
    const contact = await Contact.findOne({ where: { id: params.id, businessId } });
    if (!contact) return err('Not found', 404);
    const parsed = noteSchema.safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    const note = await ContactNote.create({ contactId: params.id, authorId: userId, content: parsed.data.content });
    return ok(note, 201);
  } catch { return err('Internal server error', 500); }
}
