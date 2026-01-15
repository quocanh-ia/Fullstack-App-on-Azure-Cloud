# ===== Build stage =====
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack to use the correct pnpm version
RUN corepack enable

# Copy manifests first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies) for TypeScript build
RUN pnpm install --prefer-frozen-lockfile

# copy source
COPY tsconfig.json ./
COPY src ./src

# build TS
RUN pnpm run build

# ===== Run stage =====
FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# production install ONLY
RUN pnpm install --prod --prefer-frozen-lockfile

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
