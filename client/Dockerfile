FROM node:20-alpine3.19 as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine3.19 as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next/standalone ./
RUN if [ -d /app/public ]; then \
    cp -r /app/public ./public; \
    fi
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]