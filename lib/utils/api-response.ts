import { NextResponse } from 'next/server';

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:4200';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status, headers: corsHeaders });
}

export function err(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status, headers: corsHeaders });
}
