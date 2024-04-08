#!/bin/bash
./share_types.sh
export NODE_TLS_REJECT_UNAUTHORIZED='0'
npm start --prefix server & sleep 5 && npm run build --prefix client && npm start --prefix client