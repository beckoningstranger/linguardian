#!/bin/bash

set -e
set -o pipefail

./share_files.sh

echo "🐳 Building backend image..."
docker compose -f docker-compose.build.yml build backend

echo "🎨 Building frontend image..."
docker compose -f docker-compose.build.yml build frontend

echo "🏁 Build complete."