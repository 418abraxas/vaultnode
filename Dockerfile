FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace apps/api run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]
