/**
 * @swagger
 * /api/seasons:
 *  get:
 *    description: Vraca listu svih sezona sortiranu po datumu pocetka
 *    responses:
 *      200:
 *        description: Uspesno povucena lista sezona
 *      500:
 *        description: Serverska greska
 *  post:
 *    description: Kreiranje nove sezone (Samo za Admina)
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - startDate
 *              - endDate
 *            properties:
 *              name:
 *                type: string
 *              startDate:
 *                type: string
 *                format: date
 *              endDate:
 *                type: string
 *                format: date
 *    responses:
 *      200:
 *        description: Sezona uspesno kreirana
 *      401:
 *        description: Niste prijavljeni ili niste admin
 *      500:
 *        description: Greska pri kreiranju
 */

import { NextResponse } from "next/server";
import { db } from "@/db"; 
import { seasons } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.query.seasons.findMany({
      orderBy: [desc(seasons.startDate)]
    });
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const result = await db.insert(seasons).values({
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}