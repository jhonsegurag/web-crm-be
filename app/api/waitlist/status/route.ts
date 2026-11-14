import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/utils/api-response';
import { Waitlist } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const email = new URL(req.url).searchParams.get('email');
    if (!email) return err('email query parameter is required', 400);

    const entry = await Waitlist.findOne({ where: { email } });
    if (!entry) return err('Email not found on waitlist', 404);

    return ok({ email: entry.email, position: entry.position, status: entry.status });
  } catch {
    return err('Internal server error', 500);
  }
}
