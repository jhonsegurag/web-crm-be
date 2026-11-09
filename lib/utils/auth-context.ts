import { NextRequest } from 'next/server';

export function getAuthContext(req: NextRequest) {
  return {
    userId: req.headers.get('x-user-id') ?? '',
    businessId: req.headers.get('x-business-id') ?? '',
  };
}
