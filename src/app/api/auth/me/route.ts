export const dynamic = "force-dynamic";
// Forsiramo Node.js runtime jer koristimo biblioteke koje nisu kompatibilne sa Edge runtime-om
export const runtime = "nodejs";


import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";


export async function GET() {
    // 1. Čitanje JWT tokena iz cookie-ja
    const token = (await cookies()).get(AUTH_COOKIE)?.value;


    // Ako token ne postoji, korisnik nije ulogovan
    if (!token) {
        return NextResponse.json({ user: null });
    }


    try {
        // 2. Verifikacija tokena i ekstrakcija podataka (claims)
        const claims = verifyAuthToken(token);


        // 3. Na osnovu user id-ja iz tokena tražimo korisnika u bazi
        const [u] = await db
            .select({
                id: users.id,
                //name: users.name,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, claims.sub));


        // 4. Ako korisnik postoji, vraćamo njegove podatke
        // Ako ne postoji (npr. obrisan iz baze), vraćamo null
        return NextResponse.json({ user: u ?? null });
    } catch {
        // 5. Ako je token nevalidan, istekao ili ne može da se verifikuje
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
