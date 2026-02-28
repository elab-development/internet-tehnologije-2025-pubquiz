import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { results } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await db.query.results.findFirst({
      where: eq(results.id, parseInt(id)),
      with: { 
        team: true, 
        event: true 
      }
    });

    if (!result) {
      return NextResponse.json({ error: "Rezultat nije pronadjen" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
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

    const existingResult = await db.query.results.findFirst({
      where: eq(results.id, parseInt(id)),
      with: { event: true }
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Rezultat nije pronadjen" }, { status: 404 });
    }
    // rezultati se se mogu menjati do 7 dana posle kviza
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (new Date(existingResult.event.dateTime) < sevenDaysAgo) {
      return NextResponse.json(
        { error: "Rezultati zavrsenih kvizova su zakljucani i ne mogu se menjati." }, 
        { status: 400 }
      );
    }

    const body = await request.json();

    const [updatedResult] = await db.update(results)
      .set({
        points: body.points !== undefined ? Number(body.points) : undefined,
        eventId: body.eventId ? Number(body.eventId) : undefined,
        teamId: body.teamId ? body.teamId : undefined,
      })
      .where(eq(results.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedResult);
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: "Ovaj tim vec ima upisan rezultat na ovom kvizu" }, { status: 409 });
    }
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

    const existingResult = await db.query.results.findFirst({
      where: eq(results.id, parseInt(id)),
      with: { event: true }
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Rezultat ne postoji" }, { status: 404 });
    }
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (new Date(existingResult.event.dateTime) < sevenDaysAgo) {
      return NextResponse.json(
        { error: "Nije moguce brisati rezultate zavrsenih kvizova." }, 
        { status: 400 }
      );
    }

    await db.delete(results).where(eq(results.id, parseInt(id)));

    return NextResponse.json({ message: "Rezultat uspesno obrisan" });
  } catch (error: any) {
    return NextResponse.json({ error: "Greska prilikom brisanja" }, { status: 500 });
  }
}