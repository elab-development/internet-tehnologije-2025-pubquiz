/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Autentifikacija korisnika
 *    description: Proverava kredencijale korisnika, izdaje JWT token i postavlja ga u HTTP-only kolačić.
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                 type: string
 *    responses:
 *      200:
 *        description: Uspešna prijava. Vraća podatke o korisniku i postavlja set-cookie zaglavlje.
 *        content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  email:
 *                    type: string
 *                  role:
 *                    type: string
 *      401:
 *        description: Neispravni kredencijali ili korisnik ne postoji.
 */

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
