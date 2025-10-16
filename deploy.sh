#!/bin/bash
set -e
set -o pipefail

BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
TIMEOUT=60  # seconds

echo "🔒 Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "🛑 Stopping and removing old containers (if any)..."
docker compose -f docker-compose.deploy.yml down || true

echo "🧹 Cleaning up unused images..."
docker image prune -af || true

echo "⬇️ Pulling latest images from ECR..."
docker compose -f docker-compose.deploy.yml pull

echo "🚀 Starting new containers..."
docker compose -f docker-compose.deploy.yml up -d

echo "⏳ Waiting for containers to become healthy (timeout: ${TIMEOUT}s)..."

start_time=$(date +%s)
backend_ready=false
frontend_ready=false

while true; do
  if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" | grep -q 200; then
    backend_ready=true
  fi

  if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q 200; then
    frontend_ready=true
  fi

  if [ "$backend_ready" = true ] && [ "$frontend_ready" = true ]; then
    echo "✅ Both backend and frontend are healthy!"
    break
  fi

  now=$(date +%s)
  elapsed=$((now - start_time))
  if [ $elapsed -ge $TIMEOUT ]; then
    echo "❌ Timeout reached (${TIMEOUT}s). Containers not healthy."
    docker ps
    exit 1
  fi

  echo "⏳ Waiting... ($elapsed s elapsed)"
  sleep 3
done

echo "🩺 Deployment successful. Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

