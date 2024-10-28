#!/bin/bash
./share_types.sh
# npm run watch-compiler --prefix server & npm run dev --prefix server & npm run dev --prefix client
docker-compose -f docker-compose.dev.yml up --build