import * as jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth"; 
const JWT_SECRET = process.env.JWT_SECRET!; 


if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in env file")
}


export type JwtUserClaims = {
    id: string;
    sub: string; 
    email: string;
    name?: string;
    role?: "ADMIN" | "TEAM"; 
}

export function signAuthToken(claims: JwtUserClaims) {
    return jwt.sign(claims, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" })
}


export function verifyAuthToken(token: string): JwtUserClaims {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims;

    
    if (!payload || !payload.sub || !payload.email) throw new Error("Invalid token");
    
    return {
        id: payload.sub,
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role 
    }
}


export function cookieOpts() {
    return {
        httpOnly: true, 
        sameSite: "lax" as const, 
        secure: process.env.NODE_ENV === "production",
        path: "/", 
        maxAge: 60 * 60 * 24 * 7 
    }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return null;

    const claims = verifyAuthToken(token);
    return claims; 
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
    const user = await getAuthUser();
    return user?.role?.toUpperCase() === "ADMIN";
}