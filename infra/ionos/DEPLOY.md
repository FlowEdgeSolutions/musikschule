# Deployment auf dem IONOS VPS (Ubuntu 24.04)

Alles läuft in Containern: PostgreSQL, die Next.js-App und Caddy als Reverse Proxy
mit automatischem Let's-Encrypt-Zertifikat.

## 1. DNS

Beim Domain-Anbieter setzen, **bevor** Caddy startet — sonst schlägt die
Zertifikatsausstellung fehl:

```text
A     musikschule.flowedge.com    217.160.93.32
```

Prüfen: `dig +short musikschule.flowedge.com`

Jede Adresse in `SITE_ADDRESSES` (siehe `.env`) braucht einen solchen Eintrag.

## 2. Server vorbereiten

Als root oder mit `sudo`:

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw
```

Firewall — SSH zuerst freigeben, sonst sperrst du dich aus:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Unprivilegierten Benutzer anlegen (falls noch nicht vorhanden):

```bash
adduser schnittke
usermod -aG sudo schnittke
```

## 3. Docker installieren

Offizielles Docker-Repository für Ubuntu:

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker schnittke
```

Ab hier als `schnittke` weiterarbeiten (`su - schnittke`), damit `docker` ohne sudo läuft.

## 4. Repository und Secrets

```bash
git clone <repo-url> schnittke-akademie
cd schnittke-akademie/infra/ionos
cp .env.example .env
```

Werte erzeugen und in `.env` eintragen:

```bash
openssl rand -hex 24    # POSTGRES_PASSWORD
openssl rand -base64 32    # ADMIN_SESSION_SECRET
```

Den Admin-Passwort-Hash auf dem **Entwicklungsrechner** erzeugen und einfügen:

```bash
cd frontend && npm run admin:hash -- "mein-langes-passwort"
```

`.env` ist per .gitignore ausgeschlossen und darf den Server nicht verlassen.

## 5. Starten

```bash
cd ~/schnittke-akademie/infra/ionos
docker compose up -d --build
docker compose ps
```

Erwartung: `postgres` und `web` laufen, `caddy` läuft, `migrate` steht auf `exited (0)`.

Logs bei Problemen:

```bash
docker compose logs -f web
docker compose logs -f caddy
```

Caddy holt das Zertifikat beim ersten Aufruf der Domain — das dauert einige Sekunden.

## 6. Inhalte anlegen

Die Datenbank ist nach dem ersten Start leer. Die Website zeigt dann die
Standardinhalte aus `frontend/src/lib/cms/default-data.ts`.

Unter `https://musikschule.flowedge.com/admin` einloggen und einmal **Speichern** —
damit werden die Inhalte in die Datenbank geschrieben und sind ab dann redaktionell
pflegbar.

## 7. Updates ausrollen

```bash
cd ~/schnittke-akademie
git pull
cd infra/ionos
docker compose up -d --build
```

Der `migrate`-Service wendet neue Migrationen automatisch vor dem Start von `web` an.

## 8. Backups

Datenbank täglich sichern (als `schnittke`, `crontab -e`):

```cron
0 3 * * * cd /home/schnittke/schnittke-akademie/infra/ionos && docker compose exec -T postgres pg_dump -U schnittke schnittke | gzip > /home/schnittke/backups/db-$(date +\%F).sql.gz
```

Verzeichnis vorher anlegen: `mkdir -p ~/backups`

Uploads liegen im Volume `ionos_uploads` (den genauen Namen zeigt
`docker volume ls`, er trägt den Compose-Projektnamen als Präfix):

```bash
docker run --rm -v ionos_uploads:/data -v ~/backups:/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

Alte Sicherungen regelmäßig auf einen anderen Rechner kopieren — ein Backup, das
nur auf demselben Server liegt, ist kein Backup.

## Wiederherstellung

```bash
gunzip -c ~/backups/db-2026-07-21.sql.gz | docker compose exec -T postgres psql -U schnittke schnittke
```
