import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { getAuthContext } from '@/lib/utils/auth-context';
import { contactSchema } from '@/schemas/contact.schema';
import { Contact } from '@/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const c = await Contact.findOne({ where: { id: params.id, businessId } });
    if (!c) return err('Not found', 404);
    return ok(c);
  } catch { return err('Internal server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const c = await Contact.findOne({ where: { id: params.id, businessId } });
    if (!c) return err('Not found', 404);
    const parsed = contactSchema.partial().safeParse(await req.json());
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);
    await c.update(parsed.data);
    return ok(c);
  } catch { return err('Internal server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { businessId } = getAuthContext(req);
    const c = await Contact.findOne({ where: { id: params.id, businessId } });
    if (!c) return err('Not found', 404);
    await c.destroy();
    return ok(null);
  } catch { return err('Internal server error', 500); }
}
