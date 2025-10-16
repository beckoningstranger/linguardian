FROM node:20-alpine3.19 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine3.19 AS runner

WORKDIR /app

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone .
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

CMD ["node", "server.js"]