FROM node:20-alpine3.19 AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

ARG GOOGLE_ID
ARG GOOGLE_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV GOOGLE_ID=$GOOGLE_ID \
    GOOGLE_SECRET=$GOOGLE_SECRET \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXTAUTH_URL=$NEXTAUTH_URL

# Copy workspace config and package files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY client/package.json ./client/

# Copy shared sources
COPY packages/shared ./packages/shared

WORKDIR /app/client
RUN pnpm install --frozen-lockfile
COPY client/ .
RUN pnpm build

FROM node:20-alpine3.19 AS runner

WORKDIR /app

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

# Copy the standalone bundle produced by Next.js
COPY --from=builder --chown=nonroot:nonroot /app/client/.next/standalone ./.next/standalone

# Copy public assets into the standalone folder so server.js can serve them
COPY --from=builder --chown=nonroot:nonroot /app/client/public ./.next/standalone/public

# Copy static assets into the standalone .next tree
COPY --from=builder --chown=nonroot:nonroot /app/client/.next/static ./.next/standalone/.next/static

# Run the minimal Next.js server from the standalone folder, per Next.js docs
CMD ["node", ".next/standalone/server.js"]
