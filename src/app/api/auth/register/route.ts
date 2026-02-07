import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


type Body = {
  name: string;
  email: string;
  password: string;
};


export async function POST(req: Request) {
  // 1. Parse request – iz request-a izdvajamo name, email i password
  const { name, email, password } = (await req.json()) as Body;


  // 2. Validate input – proveravamo da li su sva polja prisutna
  // Ako neki podatak nedostaje, vraćamo 400
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }


  // 3. Check if user already exists – proveravamo da li email već postoji u bazi
  // Ako korisnik postoji, vraćamo 400
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, email));


  if (exists.length) {
    return NextResponse.json(
      { error: "Email postoji u bazi" },
      { status: 400 }
    );
  }


  // 4. Hash password – heširamo lozinku pre čuvanja u bazi
  const passHash = await bcrypt.hash(password, 10);


  // 5. Create user – upisujemo novog korisnika u bazu
  // Vraćamo osnovne podatke o korisniku
  const [u] = await db
    .insert(users)
    .values({ name, email, passwordHash: passHash })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });


  // 6. Sign JWT – generišemo JWT token za novoregistrovanog korisnika
  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    name: u.name ?? "", // ?? "" trenutno resenje, jer usere u bazi koji nemaju ime. POtrebno je dodati notNull u schema i ispraviti to
  });


  // 7. Set cookie with JWT – postavljamo token u cookie
  // Cookie je httpOnly i secure (definisano u cookieOpts)
  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());


  // 8. Return JSON user data – frontend dobija podatke o novom korisniku
  return res;
}
