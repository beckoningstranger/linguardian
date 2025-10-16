#!/bin/bash
set -e
set -o pipefail

FRONTEND_URL="https://www.linguardian.com"
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

echo "⏳ Waiting for frontend to become healthy (timeout: ${TIMEOUT}s)..."

start_time=$(date +%s)
frontend_ready=false

while true; do
  if curl -k -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q 200; then
    frontend_ready=true
  fi

  if [ "$frontend_ready" = true ]; then
    echo "✅ Frontend is healthy!"
    break
  fi

  now=$(date +%s)
  elapsed=$((now - start_time))
  if [ $elapsed -ge $TIMEOUT ]; then
    echo "❌ Timeout reached (${TIMEOUT}s). Frontend not healthy."
    docker ps
    exit 1
  fi

  echo "⏳ Waiting... ($elapsed s elapsed)"
  sleep 3
done

echo "🩺 Deployment successful. Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

