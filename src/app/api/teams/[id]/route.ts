import { NextResponse } from "next/server";
import { getAuthUser, isAdmin } from "@/lib/auth"; 
import { db } from "@/db";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const requestedTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!requestedTeam) {
      return NextResponse.json({ error: "Tim nije pronadjen" }, { status: 404 });
    }

    const adminAccess = await isAdmin();
    const isOwner = requestedTeam.userId === user.id;

    if (!adminAccess && !isOwner) {
      return NextResponse.json(
        { error: "Zabranjeno: Mozete pristupiti samo svom timu" },
        { status: 403 }
      );
    }

    return NextResponse.json(requestedTeam, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    const { id } = await params;

    if (!user) return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });

    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!existingTeam) return NextResponse.json({ error: "Tim ne postoji" }, { status: 404 });

    const adminAccess = await isAdmin();
    const isOwner = user.id === existingTeam.userId;

    if (!adminAccess && !isOwner) {
      return NextResponse.json({ error: "Nemate dozvolu za izmenu" }, { status: 403 });
    }

    const body = await request.json();

    const [updatedTeam] = await db.update(teams)
      .set({
        teamName: body.teamName,
        captainName: body.captainName,
        members: body.members,
      })
      .where(eq(teams.id, id))
      .returning();

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: "Ime tima je vec zauzeto" }, { status: 409 });
    }
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminAccess = await isAdmin();

    if (!adminAccess) {
      return NextResponse.json({ error: "Samo admin moze obrisati tim" }, { status: 403 });
    }

    const { id } = await params;

    const deleted = await db.delete(teams)
      .where(eq(teams.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Tim ne postoji" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tim uspesno obrisan" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Greska prilikom brisanja" }, { status: 500 });
  }
}