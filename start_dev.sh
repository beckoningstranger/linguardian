#!/bin/bash
# export $(grep -v '^#' ./server/.env | xargs) && npm run dev --prefix server & npm run dev --prefix client
docker-compose -f docker-compose.dev.yml up 
