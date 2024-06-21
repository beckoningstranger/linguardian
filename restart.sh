#!/bin/bash
./share_types.sh
# export NODE_TLS_REJECT_UNAUTHORIZED='0'
npm start --prefix server & npm start --prefix client