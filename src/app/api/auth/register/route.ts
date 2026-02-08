import { db } from "@/db";
import { users, teams } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Tip body-a koji očekujemo od frontenda
type Body = {
  teamName: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  // 1. Parse request – iz request-a izdvajamo teamName, email i password
  const { teamName, email, password } = (await req.json()) as Body;

  // 2. Validate input – proveravamo da li su sva polja prisutna
  // Ako neki podatak nedostaje, vraćamo 400
  if (!teamName || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  // 3. Check if user already exists – proveravamo da li email već postoji u bazi
  // Ako korisnik postoji, vraćamo 400
  const exists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (exists.length) {
    return NextResponse.json(
      { error: "Email postoji u bazi" },
      { status: 400 }
    );
  }

  // 4. Hash password – heširamo lozinku pre čuvanja u bazi
  const passHash = await bcrypt.hash(password, 10);

  // 5. Create user + team – koristimo transakciju da sve upise bude atomarno
  const result = await db.transaction(async (tx) => {
    // 5a. Kreiranje USER naloga
    const [u] = await tx.insert(users).values({
      email,
      passwordHash: passHash,
      role: "TEAM", // !!!
    }).returning({
      id: users.id,
      email: users.email,
      role: users.role,
    });

    // 5b. Kreiranje TEAM profila
    const [t] = await tx.insert(teams).values({
      userId: u.id,          // povezujemo team sa korisnikom
      teamName,              
      teamLeader: "Unknown", // može se naknadno update-ovati
      members: "",           // može se naknadno update-ovati
    }).returning({
      id: teams.id,
      teamName: teams.teamName,
    });

    // 5c. Vraćamo oba objekta iz transakcije
    return { user: u, team: t };
  });

  // 6. Sign JWT – generišemo JWT token za novoregistrovanog korisnika
  const token = signAuthToken({
    sub: result.user.id,
    email: result.user.email,
    role: result.user.role as "ADMIN" | "TEAM" | "GUEST",
  });

  // 7. Set cookie with JWT – postavljamo token u cookie
  // Cookie je httpOnly i secure (definisano u cookieOpts)
  const res = NextResponse.json(result);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  // 8. Return JSON user data – frontend dobija podatke o novom korisniku i timu
  return res;
}
