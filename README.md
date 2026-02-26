Pub Quiz
Ovo je web aplikacija za organizaciju pub kvizova, vođenje evidencije o timovima i automatsko generisanje rang listi na osnovu osvojenih poena.

Ključne funkcionalnosti:

Administracija sezona i kviz događaja
Registracija timova i upravljanje članovima
Automatski proračun poena i vizuelni prikaz napretka timova
Prikaz događaja u kalendaru

Tehnološki stack:

Frontend i Backend: Next.js
Baza podataka: PostgreSQL
ORM: Drizzle ORM
Autentifikacija: Bcryptjs (Secure Hashing)
Styling: Tailwind CSS

Uputstvo za instalaciju i pokretanje
Da biste pokrenuli projekat lokalno, pratite ove korake:

Instalacija zavisnosti:
npm install

Podešavanje baze:
Podesite .env fajl i dodajte vašu DATABASE_URL.

Sinhronizacija šeme:
npx drizzle-kit push

Popunjavanje baze test podacima:
npx tsx src/db/seed.ts

Pokretanje razvojnog servera:
npm run dev