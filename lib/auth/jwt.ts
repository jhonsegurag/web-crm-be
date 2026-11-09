import { SignJWT, jwtVerify } from 'jose';
import type { JwtPayload } from "@/types/auth";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'secret');
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRY ?? '7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}
