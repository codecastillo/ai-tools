# ai.tools

A reference site that helps students learn the AI tools real developers ship with. Each tool gets an install guide, usage tips, and a cheat sheet. Visitors can browse, compare two tools side by side, and view curated stacks. Anyone can submit a new tool; a curator reviews and publishes it.

## Stack

- **Next.js 16** (App Router, server components)
- **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** (via `pg`)
- **Railway** for hosting

## Local development

```bash
# 1. Install
npm install

# 2. Set env
cp .env.example .env
# Edit DATABASE_URL and ADMIN_PASSWORD

# 3. Start a local Postgres (Docker, easiest)
docker run -d --name aitools-pg \
  -e POSTGRES_PASSWORD=localpw -e POSTGRES_DB=aitools \
  -p 5434:5432 postgres:16

# DATABASE_URL=postgres://postgres:localpw@localhost:5434/aitools

# 4. Run dev
npm run dev
```

Visit http://localhost:3000. Migrations + seed run automatically on the first request.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server (`PORT` env) |
| `npm run typecheck` | TypeScript-only check |
| `npm run lint` | ESLint |

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_PASSWORD` | Yes | Gates `/admin` |
| `PORT` | No | Server port (default 3000) |

## Deploy to Railway

1. Create a Railway project and add the Postgres plugin (provides `DATABASE_URL`).
2. Set `ADMIN_PASSWORD` in the service variables.
3. Connect this repo. Railway picks up `railway.json` for build/start config; healthcheck is `/api/health`.
