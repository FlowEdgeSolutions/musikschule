# Schnittke Akademie

Website und Admin-Bereich der Alfred Schnittke Akademie International.

Eine einzige Next.js-Anwendung: Seiten, API-Routen, Admin-UI und Datenzugriff
liegen in derselben TypeScript-Codebasis. Als Datenbank dient PostgreSQL.

## Struktur

```text
schnittke-akademie/
  frontend/      # Next.js: Website, Admin-UI, API-Routen, Datenbank-Layer
  infra/ionos/   # Docker Compose, Caddy und PostgreSQL für den IONOS-VPS
```

## Lokale Entwicklung

Voraussetzungen: Node 22+ und Docker (nur für PostgreSQL).

```powershell
# PostgreSQL starten
docker run -d --name schnittke-db -p 5432:5432 `
  -e POSTGRES_DB=schnittke -e POSTGRES_USER=schnittke -e POSTGRES_PASSWORD=schnittke `
  postgres:17-alpine

cd frontend
npm install
Copy-Item .env.example .env      # DATABASE_URL passt bereits
npm run db:migrate
npm run db:seed
npm run dev
```

Die Seite läuft auf `http://localhost:3000`, der Admin-Bereich auf `/admin`.

Für den Login einen Passwort-Hash erzeugen und in `.env` eintragen:

```powershell
npm run admin:hash -- "mein-langes-passwort"
```

Dazu ein `ADMIN_SESSION_SECRET` setzen (beliebige lange Zufallszeichenkette).

## npm-Skripte

| Skript | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build (`output: standalone`) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Migration aus `src/lib/db/schema.ts` erzeugen |
| `npm run db:migrate` | Migrationen anwenden |
| `npm run db:seed` | Standardinhalte in eine leere Datenbank schreiben |
| `npm run db:studio` | Drizzle Studio |
| `npm run admin:hash` | Wert für `ADMIN_PASSWORD_HASH` erzeugen |

## Architektur in Kürze

- **Inhalte** liegen in PostgreSQL (`site_content`, `events`, `posts`,
  `ticket_requests`, `media_assets`), Schema in `frontend/src/lib/db/schema.ts`.
- **Zugriff** ausschließlich über `frontend/src/lib/cms/store.ts` — Seiten und
  API-Routen kennen die Datenbank nicht direkt.
- **Uploads** landen in `frontend/uploads/` (in Produktion ein Docker-Volume,
  Pfad über `UPLOAD_DIR`) und werden über `/api/media/<datei>` ausgeliefert.
  Bewusst nicht unter `public/`: der Standalone-Server liefert dort nur aus,
  was schon beim Build vorhanden war.
- **Admin-Login** über ein Passwort (scrypt-Hash) und ein signiertes,
  httpOnly-Session-Cookie mit 8 Stunden Laufzeit.

## Deployment

Der Server ist ein IONOS-VPS mit Ubuntu 24.04 (musikschule.flowedge.com). Die vollständige Anleitung steht in
[infra/ionos/DEPLOY.md](infra/ionos/DEPLOY.md).

Kurzfassung auf dem Server:

```bash
cd infra/ionos
cp .env.example .env    # Werte eintragen
docker compose up -d --build
```

Damit laufen PostgreSQL, die Anwendung und Caddy (automatisches HTTPS).
