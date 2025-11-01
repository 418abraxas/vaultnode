# Dockerfile (at repo root) – builds only the API workspace
FROM node:20-alpine AS deps
WORKDIR /app
# Copy root and API manifests for better cache
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
# If you use .npmrc with tokens, copy it here too:
# COPY .npmrc ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
# Build only the API workspace
RUN npm --workspace apps/api run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Bring hoisted deps + workspace deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
# Built output & package metadata
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]
