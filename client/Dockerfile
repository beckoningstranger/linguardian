FROM node:20-alpine3.19 as builder

WORKDIR /app

ARG GOOGLE_ID
ARG GOOGLE_SECRET
ARG NEXTAUTH_SECRET

RUN sh -c 'echo "GOOGLE_SECRET=$GOOGLE_SECRET" >> .env.local' && \
    sh -c 'echo "GOOGLE_ID=$GOOGLE_ID" >> .env.local' && \
    sh -c 'echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local'

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine3.19 as runner

WORKDIR /app

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone .
COPY --from=builder --chown=nonroot:nonroot /app/app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/.env.local .

CMD ["node", "server.js"]