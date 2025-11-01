# VaultNode API (Railway-ready)

## Quickstart

```bash
# 1) Install deps
npm i

# 2) Create .env
cp .env.example .env
# edit DATABASE_URL, API_KEY, CORS_ORIGINS, JWT_SECRET

# 3) DB setup
npm run generate
npm run migrate
npm run seed # optional

# 4) Dev server
npm run dev

# 5) Open API docs
http://localhost:3000/docs
```

## Deploy on Railway
- Create a PostgreSQL database add-on
- Set DATABASE_URL, API_KEY, CORS_ORIGINS, JWT_SECRET
- Deploy repo. Health: /healthz

## Structure
- apps/api Fastify + Prisma backend
- openapi/vaultnode.yaml contract
- prisma/schema.prisma database models


---

# OpenAPI

## `openapi/vaultnode.yaml`
> Use the exact OpenAPI 3.1 spec I emitted earlier (v1.1). Save it here.