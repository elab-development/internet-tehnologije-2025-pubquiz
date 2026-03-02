# Pub Quiz

Ovo je web aplikacija za organizaciju pub kvizova, vođenje evidencije o timovima i automatsko generisanje rang listi na osnovu osvojenih poena.

## Ključne funkcionalnosti

**Scoreboard:** Automatsko računanje ukupnih poena timova kroz sezone sa preciznim rangiranjem.
**Interaktivni kalendar:** Pregled svih kvizova po mesecima sa detaljnim pop-up informacijama o lokaciji i vremenu.
**My Profile:** Interaktivna statistika tima, vizuelni prikaz progresa kroz *Line Chart* i jednostavno upravljanje podacima.
**Admin Panel:** Kompletne CRUD operacije za upravljanje sezonama, kvizovima i rezultatima.
**Eksterna Integracija:**
    **Open Trivia DB:** Dinamičko povlačenje nasumičnih pitanja za pripremu kvizova.
    **Google Calendar:** Automatsko generisanje linkova za dodavanje događaja u lični kalendar.

---
## Tehnološki stack:

Frontend i Backend: Next.js 16 (App Router)
Baza podataka: PostgreSQL
ORM: Drizzle ORM
Autentifikacija: Bcryptjs (Secure Hashing)
Styling: Tailwind CSS
Dokumentacija: Swagger (OpenAPI 3.0)
Kontejnerizacija: Docker

---
## Implementirane mere bezbednosti

**Prevencija SQL Injection-a:** Aplikacija koristi Drizzle ORM koji interno implementira parametrizaciju svih SQL upita. Ovim se razdvaja logika koda od korisničkih podataka, čime se u potpunosti eliminiše rizik od SQL Injection napada
**XSS zaštita:** Next.js automatski vrši "output escaping" svih podataka pri renderovanju, sprečavajući injekciju zlonamernih skripti u klijentski browser.
**IDOR zaštita:** Implementirana je autorizacija na nivou resursa. Server ne dozvoljava manipulaciju podacima samo na osnovu prosleđenog ID-ja, već vrši proveru vlasništva nad resursom pre svake baze podataka operacije (Update/Delete).
**Integritet podataka:** Implementirano softversko zaključavanje rezultata nakon 7 dana radi sprečavanja neovlašćenih naknadnih izmena.

---

## Automatizovani testovi

Za osiguranje stabilnosti i kvaliteta koda koristi se **Vitest**:
* **Unit Tests:** Validacija poslovne logike, kalkulacija poena i ispravnost ulaznih podataka.
* **Integracioni testovi:** Provera dostupnosti API ruta i ispravnosti odgovora servera.

Pokretanje testova:
`npm test`

---
## Uputstvo za instalaciju i pokretanje
Da biste pokrenuli projekat lokalno, pratite ove korake:

1. Instalacija zavisnosti:
`npm install`

2. Podešavanje baze:
Podesite .env fajl i dodajte vašu DATABASE_URL.

3. Sinhronizacija šeme:
`npx drizzle-kit push`

4. Popunjavanje baze test podacima:
`npx tsx src/db/seed.ts`

5. Pokretanje razvojnog servera:
`npm run` 


---
**API dokumentacija** je dostupna na ruti /api-docs nakon što pokrenete aplikaciju.

