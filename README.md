# CortexaMonitor

Dashboard de monitoreo interno — Cortexacloud.

## Stack
- Frontend: Next.js 15 + Tailwind CSS + Shadcn UI + NextAuth v5
- Backend: NestJS 11 + Prisma
- DB: PostgreSQL 16
- Cache: Redis 7
- Proxy: Nginx
- Runtime: 100% Docker Compose

## Dev local
cp .env.example .env
docker compose up --build

## Git workflow
- Desarrollo en rama `dev`
- PR dev → main activa GitHub Actions → deploy VPS
- Nunca pushear directo a main
