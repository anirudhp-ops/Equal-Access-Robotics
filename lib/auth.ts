import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "local-development-secret-change-me");
export type SessionUser = { id:number; name:string; email:string; role:"student"|"tutor"|"admin" };

export async function createToken(user: SessionUser) {
  return new SignJWT(user).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret);
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get("ear_session")?.value;
  if (!token) return null;
  try { const {payload} = await jwtVerify(token, secret); return payload as unknown as SessionUser; } catch { return null; }
}
