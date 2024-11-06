#!/bin/bash
./share_types.sh
# npm start --prefix server & sleep 5 && npm run build --prefix client && npm start --prefix client
docker compose up -d backend
echo "Waiting for the backend to be ready..."
sleep 5
./client/getDataToBuild.sh http://localhost:8000
docker compose up frontend --build