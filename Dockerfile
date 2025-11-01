# Dockerfile (at repo root)
FROM node:20-alpine AS deps
WORKDIR /app
# Copy manifests so npm sees workspaces
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
# (Optional) private registries:
# COPY .npmrc ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
# Bring node_modules into the build stage so scripts (tsc) exist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
# Now copy the source
COPY . .
# Build only the API workspace (tsc is available via node_modules/.bin)
RUN npm --workspace apps/api run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Bring runtime deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
# Bring built files
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]
