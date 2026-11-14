import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { JwtPayload } from "@/types/auth";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback_secret_change_in_production"
);

const PUBLIC_PATHS = [
  '/api/auth/login', 
  '/api/auth/register'
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function withCors(res: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return withCors(NextResponse.next());
  }

  const PUBLIC_ROUTES = [
    { path: '/api/waitlist/status', methods: '*' as const },
    { path: '/api/waitlist',        methods: ['POST'] },
  ];
  const isPublicRoute = PUBLIC_ROUTES.some((r) => {
    const pathMatches = pathname === r.path || pathname.startsWith(r.path + '/');
    const methodMatches = r.methods === '*' || r.methods.includes(req.method);
    return pathMatches && methodMatches;
  });
  if (isPublicRoute) return withCors(NextResponse.next());

  const authHeader = req.headers.get('authorization') ?? '';
  if (!authHeader?.startsWith("Bearer ")) {
    return withCors(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
  }

  try {
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, secret);
    const jwtPayload = payload as unknown as JwtPayload;

    const res = NextResponse.next();
    res.headers.set('x-user-id', jwtPayload.sub);
    res.headers.set('x-business-id', jwtPayload.businessId ?? '');
    return withCors(res);
  } catch {
    return withCors(NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 }));
  }
}

export const config = { 
  matcher: ['/api/:path*'] };
