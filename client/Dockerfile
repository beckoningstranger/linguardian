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

COPY --from=builder --chown=nonroot:nonroot /app/client/.next/standalone .
COPY --from=builder --chown=nonroot:nonroot /app/client/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/client/.next/static ./.next/static

# Copy node_modules from builder to ensure all runtime dependencies are available
COPY --from=builder --chown=nonroot:nonroot /app/client/node_modules ./node_modules

# Move server.js to the expected location (must be done as root)
RUN mv client/server.js ./server.js

USER nonroot

CMD ["node", "server.js"]
