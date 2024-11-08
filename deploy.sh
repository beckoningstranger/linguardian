#!/bin/bash
./share_types.sh

echo "MONGO:"$MONGO_URL
echo "GOOGLE":$GOOGLE_ID
docker compose up -d backend
echo "Waiting for the backend to be ready..."

until curl -s http://localhost:8000 > /dev/null; do
  sleep 1 
done

echo "Backend is ready. Proceeding with data retrieval..."
./client/getDataToBuild.sh http://localhost:8000
docker compose up frontend --build