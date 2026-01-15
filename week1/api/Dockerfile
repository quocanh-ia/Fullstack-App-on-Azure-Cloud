# ===== Build stage =====
FROM node:20-alpine AS builder
WORKDIR /app

# dùng pnpm đúng version
RUN corepack enable

# copy manifest trước
COPY package.json pnpm-lock.yaml ./

# CÀI ĐẦY ĐỦ (bao gồm devDependencies để build TS)
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
