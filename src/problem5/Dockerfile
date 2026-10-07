# syntax=docker/dockerfile:1

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Runner (production) ----
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER appuser
EXPOSE 3000

CMD ["node", "dist/server.js"]
