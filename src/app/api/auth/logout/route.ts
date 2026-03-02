/**
 * @swagger
 * /api/auth/logout:
 *    post:
 *      summary: Odjava korisnika
 *      description: Briše autentifikacioni kolačić postavljanjem njegovog trajanja na nulu, čime se završava sesija korisnika.
 *      tags:
 *          - Auth
 *      responses:
 *          200:
 *              description: Uspešna odjava. Kolačić je obrisan iz pretraživača.
 *              content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ok:
 *                              type: boolean
 */
import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST() {
    const res = NextResponse.json({ ok: true })


    res.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
        expires: new Date(0) // istekao 01.01.1970. browser ga sam brise
    })


    return res;
}
