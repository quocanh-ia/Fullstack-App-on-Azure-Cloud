# ===== Build stage =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy manifest trước để tận dụng cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy source và build
COPY . .
RUN npm run build

# ===== Run stage =====
FROM node:20-alpine
WORKDIR /app

# Serve static files
RUN npm i -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
