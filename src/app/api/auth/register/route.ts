import { db } from "@/db";
import { users, teams } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


type Body = {
  teamName: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {

  const { teamName, email, password } = (await req.json()) as Body;


  if (!teamName || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }


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

 
  const passHash = await bcrypt.hash(password, 10);

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
      userId: u.id,          
      teamName,              
      teamLeader: "Unknown", // može se naknadno update-ovati
      members: "",           // može se naknadno update-ovati
    }).returning({
      id: teams.id,
      teamName: teams.teamName,
    });

    
    return { user: u, team: t };
  });

 
  const token = signAuthToken({
    sub: result.user.id,
    email: result.user.email,
    role: result.user.role as "ADMIN" | "TEAM" | "GUEST",
  });


  const res = NextResponse.json(result);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());


  return res;
}
