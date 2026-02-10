export const dynamic = "force-dynamic";
export const runtime = "nodejs";


import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";


export async function GET() {
    
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
        return NextResponse.json({ user: null });
    }

    try {
        
        const claims = verifyAuthToken(token);

        const [u] = await db
            .select({
                id: users.id,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, claims.sub));

        return NextResponse.json({ user: u ?? null });
    } catch {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
