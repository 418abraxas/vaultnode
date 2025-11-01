# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./

# Add prisma, jwt, and types here if missing
RUN npm install --no-audit --no-fund \
    @prisma/client prisma jsonwebtoken @types/jsonwebtoken
RUN npm install --no-audit --no-fund yaml

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client during build
RUN npx prisma generate || echo "Skipping prisma generate"
RUN npx tsc -p tsconfig.json

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
