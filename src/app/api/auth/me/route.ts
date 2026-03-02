/**
 * @swagger
 * /api/auth/me:
 *  get:
 *    summary: Dobavljanje trenutno ulogovanog korisnika
 *    description: Čita JWT token iz kolačića i vraća podatke o korisniku ako je sesija validna.
 *    tags:
 *      - Auth
 *    responses:
 *      200:
 *        description: Uspešno dobavljeni podaci o korisniku.
 *        content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                nullable: true
 *                properties:
 *                  id:
 *                    type: string
 *                  email:
 *                    type: string
 *                  role:
 *                    type: string
 *      401:
 *        description: Korisnik nije ulogovan (sesija ne postoji ili je istekla).
 *      500:
 *        description: Interna greška servera prilikom dekodiranja tokena.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";



export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
