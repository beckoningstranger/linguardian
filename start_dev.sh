#!/bin/bash
./share_files.sh
# npm run watch-compiler --prefix server & export $(cat ./server/.env | xargs) && npm run dev --prefix server & npm run dev --prefix client
docker-compose -f docker-compose.dev.yml up --build