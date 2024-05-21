#!/bin/bash
./share_types.sh
# export NODE_TLS_REJECT_UNAUTHORIZED='0'
npm run watch-compiler --prefix server & npm run dev --prefix server & npm run dev --prefix client