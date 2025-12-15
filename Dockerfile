FROM node:20-alpine3.19

# Install pnpm, tsx, ts-node, and @tsconfig/node20 globally
RUN npm install -g pnpm tsx ts-node @tsconfig/node20

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./

# Copy all package.json files to enable proper dependency resolution
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY packages/shared/package.json ./packages/shared/

# Copy source code for shared package (needed for prepare script)
COPY packages/shared/ ./packages/shared/

# Install all dependencies for the workspace (this will build shared package)
RUN --mount=type=cache,target=/root/.local/share/pnpm \
    pnpm install

# Install server dependencies locally
RUN cd server && CI=true pnpm install

# Copy remaining source code
COPY client/ ./client/
COPY server/ ./server/

# Expose ports for both services
EXPOSE 3000 8000

# Default command - can be overridden in docker-compose
CMD ["sh", "-c", "echo 'Workspace ready. Use docker-compose services for individual commands.'"]
