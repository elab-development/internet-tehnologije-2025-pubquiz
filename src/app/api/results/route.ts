/**
 * @swagger
 * /api/results:
 *  get:
 *    description: Vraca listu svih rezultata sa povezanim timovima i dogadjajima
 *    responses:
 *      200:
 *        description: Uspesno povuceni rezultati
 *      500:
 *        description: Serverska greska
 *  post:
 *    description: Unos novog rezultata za tim na odredjenom dogadjaju
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - eventId
 *              - teamId
 *              - points
 *            properties:
 *              eventId:
 *                type: integer
 *                description: ID kviza
 *              teamId:
 *                type: string
 *                description: UUID tima
 *              points:
 *                type: integer
 *                description: Broj osvojenih poena
 *    responses:
 *      201:
 *        description: Rezultat uspesno sacuvan
 *      400:
 *        description: Nedostaju obavezna polja
 *      500:
 *        description: Serverska greska
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { results, seasons } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const allResults = await db.query.results.findMany({
      with: {
        team: true,
        event: {
          with: {
            season: true 
          }
        }
      },
      // sortira tako da najnoviji rezultati budu prvi
      // to znaci da ce najstarija sezona zavrsiti na dnu tabele
      orderBy: [desc(results.id)] 
    });

    return NextResponse.json(allResults, { status: 200 });
  } catch (error) {
    console.error("Greska prilikom dohvatanja rezultata:", error);
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, teamId, points } = body;

    if (!eventId || !teamId || points === undefined) {
      return NextResponse.json({ error: "Sva polja su obavezna" }, { status: 400 });
    }

    const newResult = await db.insert(results).values({
      eventId: parseInt(eventId),
      teamId: teamId,
      points: parseInt(points),
    }).returning();

    return NextResponse.json(newResult[0], { status: 201 });
  } catch (error) {
    console.error("Greška prilikom čuvanja rezultata:", error);
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}