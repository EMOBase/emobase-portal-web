# Build stage
FROM node:22-slim AS build
WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application and build the standalone Astro server
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Runtime stage
FROM node:22-slim AS runtime
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
