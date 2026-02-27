import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


type Body = {
  email: string;
  password: string;
};


export async function POST(req: Request) {
  const { email, password } = (await req.json()) as Body;


  if (!email || !password) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka" },
      { status: 401 }
    );
  }

  const [u] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));


  if (!u) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  const token = signAuthToken({
    sub: u.id,
    id: u.id,
    email: u.email,
    role: u.role as any
  });

  
  const res = NextResponse.json({
    user: {
        id: u.id,
        email: u.email,
        role: u.role,
      }
  });
  
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
