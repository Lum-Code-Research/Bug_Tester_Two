# INTENTIONAL: weak for security Action testing (Snyk IaC)
# - Runs as root
# - Hardcodes secrets via ENV
# - Uses an outdated base image tag style for demo purposes
FROM node:18

ENV API_KEY=sk-live-7f3a9c2e1b8d4f6a9c0e2b4d6f8a0c2e
ENV ADMIN_PASSWORD=AdminPass!2024
ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
# INTENTIONAL: installs all deps (including tooling) as root for IaC demo
RUN npm ci

COPY . .

EXPOSE 3000

# INTENTIONAL: container process runs as root
CMD ["npx", "ts-node", "src/app.ts"]
