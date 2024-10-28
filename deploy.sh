#!/bin/bash
./share_types.sh
# npm start --prefix server & sleep 5 && npm run build --prefix client && npm start --prefix client

docker-compose build backend
docker-compose up -d backend
docker-compose build frontend
docker-compose up frontend