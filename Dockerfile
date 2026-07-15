# Secure multi-stage image for BoardLite
FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV USE_OFFLINE_DB=true

RUN groupadd --system boardlite && useradd --system --gid boardlite boardlite

COPY --from=build /app /app
RUN chown -R boardlite:boardlite /app

USER boardlite
EXPOSE 3000

CMD ["npx", "ts-node", "src/app.ts"]
