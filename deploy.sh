#!/bin/bash
./share_types.sh
npm start --prefix server & sleep 5 && npm run build --prefix client && npm start --prefix client