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
