#!/bin/bash
./share_files.sh

echo "Building backend image..."
docker compose -f docker-compose.build.yml build backend
echo "Running backend container..."
docker compose -f docker-compose.build.yml up -d backend

echo "Waiting for the backend to be ready..."
until curl -s http://localhost:8000 > /dev/null; do
  sleep 1 
done

echo "Backend is ready. Proceeding with data retrieval..."
./client/getDataToBuild.sh http://localhost:8000
docker compose -f docker-compose.build.yml down
docker compose -f docker-compose.build.yml build frontend