import { NextRequest } from 'next/server';

export function parsePagination(req: NextRequest) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 20)));
  return { page, pageSize, offset: (page - 1) * pageSize };
}
