FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config and package files
COPY pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY server/package.json ./server/

# Copy shared sources
COPY packages/shared ./packages/shared

# Install dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm \
    pnpm install --frozen-lockfile

# Copy server sources
COPY server ./server

WORKDIR /app/server

RUN pnpm build

CMD ["pnpm", "start"]
