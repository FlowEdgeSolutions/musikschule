# Schnittke Akademie Backend

Python/FastAPI backend for admin content, ticket requests and media uploads.

The Next.js frontend lives in `../frontend`. This service is the prepared backend for the Hetzner/PostgreSQL setup.

## Local development

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python scripts/hash_password.py "your-password"
```

Put the generated hash into `ADMIN_PASSWORD_HASH` and set a long random `ADMIN_SESSION_SECRET`.

Start with SQLite fallback:

```bash
uvicorn app.main:app --reload
```

Start with PostgreSQL:

```bash
docker compose up --build
```

API base:

```text
http://localhost:8000
```

Docs:

```text
http://localhost:8000/docs
```

## Important routes

- `GET /health`
- `GET /api/content`
- `GET /api/events`
- `GET /api/posts`
- `POST /api/tickets`
- `POST /api/admin/login`
- `GET /api/admin/cms`
- `PUT /api/admin/cms`
- `POST /api/admin/uploads`

## Migrations

The MVP can create tables automatically with `AUTO_CREATE_TABLES=true`.
For production on Hetzner, prefer Alembic migrations:

```bash
cd backend
alembic upgrade head
```

## Hetzner

Use `infra/hetzner/docker-compose.yml` as the starting point. It runs:

- PostgreSQL
- FastAPI backend
- Caddy reverse proxy with automatic HTTPS

Before production use, change all passwords/secrets and set the real domain in `infra/hetzner/Caddyfile`.
