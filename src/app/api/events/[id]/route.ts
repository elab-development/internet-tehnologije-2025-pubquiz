/**
 * @swagger
 * /api/events/{id}:
 *  get:
 *    description: Vraca detalje o konkretnom kvizu sa podacima o sezoni
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Podaci o kvizu su uspesno pronadjeni
 *      404:
 *        description: Kviz nije pronadjen
 *      500:
 *        description: Greska na serveru
 *  patch:
 *    description: Izmena postojeceg kviza (Samo Admin, samo ako kviz nije zavrsen)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              seasonId:
 *                type: integer
 *              dateTime:
 *                type: string
 *                format: date-time
 *              location:
 *                type: string
 *              description:
 *                 type: string
 *    responses:
 *      200:
 *        description: Kviz uspesno azuriran
 *      400:
 *        description: Nije moguce menjati zavrsene kvizove
 *      403:
 *        description: Zabranjen pristup (Niste admin)
 *      404:
 *        description: Kviz ne postoji
 *  delete:
 *    description: Brisanje kviza (Samo Admin, samo ako kviz nije zavrsen)
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Kviz uspesno obrisan
 *      400:
 *        description: Nije moguce brisati zavrsene kvizove
 *      403:
 *        description: Zabranjen pristup
 *      404:
 *        description: Kviz ne postoji
 */

import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth"; 
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await db.query.events.findFirst({
      where: eq(events.id, parseInt(id)), 
      with: { season: true } 
    });

    if (!event) {
      return NextResponse.json({ error: "Kviz nije pronadjen" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminAccess = await isAdmin();
    const { id } = await params;

    if (!adminAccess) {
      return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
    }

    const existingEvent = await db.query.events.findFirst({
      where: eq(events.id, parseInt(id))
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Kviz ne postoji" }, { status: 404 });
    }

    if (new Date(existingEvent.dateTime) < new Date()) {
      return NextResponse.json(
        { error: "Nije moguce menjati kvizove koji su zavrseni" }, 
        { status: 400 }
      );
    }

    const body = await request.json();

    const [updatedEvent] = await db.update(events)
      .set({
        title: body.title,
        seasonId: body.seasonId,
        dateTime: body.dateTime ? new Date(body.dateTime) : undefined,
        location: body.location,
        description: body.description,
      })
      .where(eq(events.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: "Greska prilikom izmene" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminAccess = await isAdmin();
    const { id } = await params;

    if (!adminAccess) {
      return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
    }

    const existingEvent = await db.query.events.findFirst({
      where: eq(events.id, parseInt(id))
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Kviz ne postoji" }, { status: 404 });
    }

    if (new Date(existingEvent.dateTime) < new Date()) {
      return NextResponse.json(
        { error: "Nije moguce brisati zavrsene kvizove" }, 
        { status: 400 }
      );
    }

    await db.delete(events).where(eq(events.id, parseInt(id)));
    
    return NextResponse.json({ message: "Kviz uspesno obrisan" });
  } catch (error) {
    return NextResponse.json({ error: "Greska prilikom brisanja" }, { status: 500 });
  }
}