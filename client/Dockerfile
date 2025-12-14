FROM node:20-alpine3.19 AS builder

WORKDIR /app

ARG GOOGLE_ID
ARG GOOGLE_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV GOOGLE_ID=$GOOGLE_ID \
    GOOGLE_SECRET=$GOOGLE_SECRET \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXTAUTH_URL=$NEXTAUTH_URL 

# Copy root manifest for workspace support
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY client/package.json client/package-lock.json ./client/

# Copy shared sources early so its build/prepare can run during install
COPY packages/shared ./packages/shared

WORKDIR /app/client
RUN npm ci --legacy-peer-deps
COPY client/ .
RUN npm run build

FROM node:20-alpine3.19 AS runner

WORKDIR /app

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

COPY --from=builder --chown=nonroot:nonroot /app/client/.next/standalone .
COPY --from=builder --chown=nonroot:nonroot /app/client/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/client/.next/static ./.next/static

CMD ["node", "server.js"]
