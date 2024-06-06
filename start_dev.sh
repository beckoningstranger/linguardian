#!/bin/bash
./share_types.sh
# export NODE_TLS_REJECT_UNAUTHORIZED='0'
rm /home/jan/linguardian/client/.next -R
npm run watch-compiler --prefix server & npm run dev --prefix server & npm run dev --prefix client